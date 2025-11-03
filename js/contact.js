// js/contact.js - EmailJS Integration for Contact Form + Auto-Reply

// Initialize EmailJS (ganti dengan PUBLIC_KEY Anda)
(function() {
    emailjs.init("yK4CIaKmp7NTh89Lc"); // Contoh: "user_ghi789"
})();

// Tunggu DOM siap
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    const formAlert = document.getElementById('formAlert');

    // Event listener untuk submit form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Cegah submit default

        // Ambil data form
        const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Validasi sederhana (opsional)
        if (!templateParams.name || !templateParams.email || !templateParams.message) {
            showAlert('Please fill all fields.', 'danger');
            return;
        }

        // Tampilkan loading state
        showLoading(true);

        // Debug: Cek apakah email pengirim valid
        if (!templateParams.email || !templateParams.email.includes('@')) {
            console.error('Invalid email in form:', templateParams.email);
            showAlert('Invalid email. Please check and try again.', 'danger');
            showLoading(false);
            return;
        }
        console.log('Valid email for reply:', templateParams.email);

        // Langkah 1: Kirim email ke Anda (template utama)
        emailjs.send('service_fi1rdii', 'template_m5hinsp', templateParams) // Ganti dengan SERVICE_ID dan TEMPLATE_ID utama
            .then(function(response) {
                console.log('Email to owner sent successfully!', response.status, response.text);
                
                // Langkah 2: Kirim auto-reply ke pengirim (setelah delay 1 detik)
                setTimeout(function() {
                    const replyParams = {
                        to_email: templateParams.email,  // Email tujuan: email pengirim
                        name: templateParams.name,      // Sapaan personal
                        message: templateParams.message // Konfirmasi pesan
                    };
                    
                    emailjs.send('service_fi1rdii', 'template_twiqq6p', replyParams) // Ganti dengan TEMPLATE_ID auto-reply
                        .then(function(replyResponse) {
                            console.log('Auto-reply sent successfully!', replyResponse.status, replyResponse.text);
                        }, function(replyError) {
                            console.error('Failed to send auto-reply:', replyError);
                            // Tidak tampilkan error ke user, tapi log saja (agar UX tetap bagus)
                        });
                }, 1000); // Delay 1 detik

                // Tampilkan success ke user
                showAlert('Message sent successfully! You will receive a confirmation email shortly.', 'success');
                contactForm.reset(); // Reset form
                showLoading(false);
            }, function(error) {
                console.error('Failed to send email:', error);
                showAlert('Oops! Something went wrong. Please try again or contact me directly via WhatsApp.', 'danger');
                showLoading(false);
            });
    });

    // Fungsi untuk menampilkan loading state pada button
    function showLoading(show) {
        if (show) {
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.style.display = 'none';
            loadingSpinner.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.style.display = 'inline-block';
            loadingSpinner.style.display = 'none';
        }
    }

    // Fungsi untuk menampilkan alert feedback
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type} d-block`; // Gunakan Bootstrap classes
        formAlert.style.display = 'block';

        // Auto-hide setelah 5 detik
        setTimeout(function() {
            formAlert.style.display = 'none';
        }, 5000);

        // Scroll ke alert jika diperlukan
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Optional: Validasi form sederhana (sudah ada required di HTML, tapi tambahan)
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc3545'; // Red border for invalid
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
});