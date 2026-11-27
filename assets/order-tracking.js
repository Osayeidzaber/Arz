document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('OrderTrackingForm');
    if (!form) return;

    const orderInput = document.getElementById('tracking_order_id');
    const contactInput = document.getElementById('tracking_contact');
    const submitBtn = form.querySelector('.tracking-form__button');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let hasError = false;

        // Reset errors
        document.querySelectorAll('.tracking-form__field').forEach(field => {
            field.classList.remove('has-error');
        });

        const orderId = orderInput.value.trim();
        const contact = contactInput.value.trim();

        if (!orderId) {
            orderInput.parentElement.classList.add('has-error');
            hasError = true;
        }

        if (!contact) {
            contactInput.parentElement.classList.add('has-error');
            hasError = true;
        }

        if (hasError) return;

        // Loading state
        submitBtn.dataset.originalText = submitBtn.innerText;
        submitBtn.innerText = 'CHECKING...';
        submitBtn.disabled = true;

        const container = document.querySelector('.tracking-portal__container');
        const apiKey = container.dataset.apiKey;
        const secretKey = container.dataset.secretKey;

        if (!apiKey || !secretKey) {
            // Fallback to redirect if keys are missing
            setTimeout(() => {
                window.location.href = `https://steadfast.com.bd/t/${orderId}`;
            }, 800);
            return;
        }

        // Direct API Fetch
        fetch(`https://portal.steadfast.com.bd/api/v1/status_by_cid/${orderId}`, {
            method: 'GET',
            headers: {
                'ApiKey': apiKey,
                'SecretKey': secretKey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.delivery_status) {
                    showResults(data);
                } else {
                    alert('Order not found. Please check your tracking ID.');
                    resetButton();
                }
            })
            .catch(error => {
                console.error('Error fetching tracking status:', error);
                alert('Unable to fetch tracking status. Please try again later.');
                resetButton();
            });
    });

    function showResults(data) {
        form.style.display = 'none';
        document.querySelector('.tracking-portal__form-header').style.display = 'none';

        const results = document.getElementById('TrackingResults');
        document.getElementById('StatusLabel').innerText = data.delivery_status.toUpperCase();
        document.getElementById('ResultCID').innerText = data.consignment_id || 'N/A';
        document.getElementById('ResultRecipient').innerText = data.recipient_name || 'N/A';
        document.getElementById('ResultAddress').innerText = data.recipient_address || 'N/A';

        results.style.display = 'block';
    }

    function resetButton() {
        submitBtn.innerText = submitBtn.dataset.originalText;
        submitBtn.disabled = false;
    }

    const resetBtn = document.getElementById('ResetTracking');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            document.getElementById('TrackingResults').style.display = 'none';
            form.style.display = 'flex';
            document.querySelector('.tracking-portal__form-header').style.display = 'block';
            resetButton();
            form.reset();
        });
    }
});
