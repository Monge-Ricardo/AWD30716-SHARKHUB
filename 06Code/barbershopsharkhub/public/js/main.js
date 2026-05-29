// Helper global para obtener cookies (CSRF)
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return null;
}

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });


})(jQuery);

document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    const sectionLinks = document.querySelectorAll("[data-section]");

    const sectionRoutes = {
        home: "/",
        about: "/about",
        service: "/service",
        price: "/price",
        team: "/team",
        open: "/open",
        testimonial: "/testimonial",
        contact: "/contact",
        notFound: "/404",
        login: "/customer/login",
        register: "/customer/register"
    };

    function extractMainContent(htmlText) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(htmlText, "text/html");
        const parsedMainContent = parsedDocument.querySelector("#main-content");

        if (!parsedMainContent) {
            return `
                <div class="container py-5">
                    <h1 class="text-uppercase">Content not found</h1>
                    <p>The requested content could not be loaded.</p>
                </div>
            `;
        }

        return parsedMainContent.innerHTML;
    }

    function setActiveLink(sectionName) {
        sectionLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.getAttribute("data-section") === sectionName) {
                link.classList.add("active");
            }
        });
    }

    function closeNavbarMenu() {
        const navbarCollapse = document.getElementById("navbarCollapse");

        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });

            bootstrapCollapse.hide();
        }
    }

    function restartTemplateAnimations() {
        if (typeof WOW !== "undefined") {
            new WOW().init();
        }

        if (window.jQuery && $(".testimonial-carousel").length > 0) {
            $(".testimonial-carousel").trigger("destroy.owl.carousel");

            $(".testimonial-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                loop: true,
                nav: false,
                dots: true,
                items: 1,
                dotsData: true
            });
        }
    }

    function loadSection(sectionName) {
        const route = sectionRoutes[sectionName];

        if (!route || !mainContent) {
            return;
        }

        fetch(route)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Section could not be loaded");
                }

                return response.text();
            })
            .then(function (htmlText) {
                mainContent.innerHTML = extractMainContent(htmlText);
                setActiveLink(sectionName);
                closeNavbarMenu();
                restartTemplateAnimations();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            })
            .catch(function (error) {
                console.error(error);

                mainContent.innerHTML = `
                    <div class="container py-5">
                        <h1 class="text-uppercase">Error</h1>
                        <p>The selected section could not be loaded.</p>
                    </div>
                `;
            });
    }

    sectionLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const sectionName = this.getAttribute("data-section");
            loadSection(sectionName);
        });
    });


    document.body.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (link) {
            const href = link.getAttribute("href");
            if (href === "/customer/login") {
                event.preventDefault();
                loadSection("login");
            } else if (href === "/customer/register") {
                event.preventDefault();
                loadSection("register");
            }
        }
    });

    // Supabase Global Auth (Event Delegation for dynamically loaded buttons)
    document.body.addEventListener("click", async function (event) {
        // Login con Google
        if (event.target.closest('#btnGoogleLogin')) {
            event.preventDefault();
            console.log("Iniciando login con Google (Global)...");
            try {
                if (!window.supabaseClient) throw new Error("Supabase Client no está inicializado");
                const { error } = await window.supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: window.location.origin + '/customer/dashboard' }
                });
                if (error) {
                    console.error("Error OAuth:", error);
                    alert('Error iniciando sesión con Google: ' + error.message);
                }
            } catch (err) {
                console.error("Excepción en OAuth:", err);
                alert("Ocurrió un error inesperado al intentar conectar con Google.");
            }
        }
        
        // Registro con Google
        if (event.target.closest('#btnGoogleRegister')) {
            event.preventDefault();
            console.log("Iniciando registro con Google (Global)...");
            try {
                if (!window.supabaseClient) throw new Error("Supabase Client no está inicializado");
                const { error } = await window.supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: window.location.origin + '/customer/dashboard' }
                });
                if (error) {
                    console.error("Error OAuth:", error);
                    alert('Error registrando con Google: ' + error.message);
                }
            } catch (err) {
                console.error("Excepción en OAuth:", err);
                alert("Ocurrió un error inesperado al intentar conectar con Google.");
            }
        }
    });

    // Handle Authentication Forms
    document.body.addEventListener("submit", async function (event) {
        if (event.target.matches("#loginForm")) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Cargando... <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    credentials: 'same-origin', // <--- IMPORTANTE para que el navegador guarde la cookie
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') // <--- TOKEN DE SEGURIDAD
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.success) {
                    // Guardar sesión para que los dashboards la lean
                    sessionStorage.setItem('sharkhub_session', JSON.stringify({
                        user_id:              result.user?.id,
                        user_name:            result.user?.name,
                        user_email:           result.user?.email,
                        role:                 result.user?.role,
                        barbershop_id:        result.user?.barbershop_id,
                        supabase_access_token: result.access_token || result.token || null,
                    }));
                    window.location.href = result.redirect;
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error al iniciar sesión.');
                console.error(error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }

        if (event.target.matches("#registerForm")) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Registrando... <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.success) {
                    alert('Registro exitoso. Ahora puedes iniciar sesión.');
                    loadSection("login");
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error en el registro.');
                console.error(error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
});

