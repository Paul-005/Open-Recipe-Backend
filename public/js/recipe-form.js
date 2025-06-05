document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipeForm');
    const imageInput = document.getElementById('recipeThumbnail');
    const imagePreview = document.getElementById('imagePreview');
    const preview = document.getElementById('preview');
    const loading = document.getElementById('loading');
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');

    // Image preview functionality
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('hidden');
        }
    });

    // Show alert message
    function showAlert(message, isSuccess = true) {
        alertMessage.textContent = message;
        alert.classList.remove('hidden');
        alert.classList.remove('bg-red-50', 'text-red-800', 'bg-green-50', 'text-green-800');
        alert.classList.add(isSuccess ? 'bg-green-50' : 'bg-red-50');
        alertMessage.classList.add(isSuccess ? 'text-green-800' : 'text-red-800');
        
        // Hide alert after 5 seconds
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 5000);
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get JWT token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('Please log in to add a recipe', false);
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('recipeName', form.recipeName.value);
        formData.append('Incredients', form.Incredients.value);
        formData.append('RecipeContent', form.RecipeContent.value);
        formData.append('recipeThumbnail', imageInput.files[0]);

        try {
            loading.classList.add('active');
            
            // Use the correct backend URL
            const response = await fetch('http://localhost:5000/recipes/new', {
                method: 'POST',
                headers: {
                    'token': token
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add recipe');
            }

            showAlert('Recipe added successfully!');
            form.reset();
            imagePreview.classList.add('hidden');
            
        } catch (error) {
            showAlert(error.message, false);
        } finally {
            loading.classList.remove('active');
        }
    });
}); 