const supabase = require('../config/supabase');
const prisma = require('../models/db');

exports.register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        
        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    username: username
                }
            }
        });

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        // Attempt to create public_users record (if no DB trigger does it automatically)
        try {
            if (data.user) {
                await prisma.public_users.upsert({
                    where: { id: data.user.id },
                    update: {},
                    create: {
                        id: data.user.id,
                        email: email,
                        full_name: name
                    }
                });
            }
        } catch (dbError) {
            console.error('Error inserting into public_users:', dbError.message);
        }

        return res.status(201).json({ success: true, message: 'Registration successful! You can now log in.' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const userId = data.user.id;
        
        // Find user role to determine routing
        const member = await prisma.barbershop_members.findFirst({
            where: { user_id: userId }
        });

        let redirectUrl = '/customer/dashboard';
        
        if (member) {
            if (member.role === 'owner') {
                redirectUrl = '/owner/dashboard';
            } else if (member.role === 'barber') {
                redirectUrl = '/barber/dashboard';
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            redirect: redirectUrl,
            session: data.session
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
