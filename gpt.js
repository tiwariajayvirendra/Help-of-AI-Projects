document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
    });
});

        // // JavaScript for making the sidebar toggle clickable
        // const menuToggle = document.getElementById('menu-toggle');
        // const sidebar = document.getElementById('sidebar');

        // menuToggle.addEventListener('click', () => {
        //     sidebar.classList.toggle('active');
        // });

        // // JavaScript for handling search functionality
        // const searchInput = document.querySelector('input[type="search"]');
        // searchInput.addEventListener('input', handleSearch);

        // function handleSearch(event) {
        //     const searchTerm = event.target.value.toLowerCase();
        //     // Implement your search logic here (filter movies, shows, etc.)
        //     // For now, let's just log the search term:
        //     console.log('Search term:', searchTerm);
        // }

        // // JavaScript for making profile bar usable (e.g., logout functionality)
        // const userProfile = document.querySelector('.user-profile');
        // userProfile.addEventListener('click', handleProfileClick);

        // function handleProfileClick() {
        //     // Implement your profile-related actions here (e.g., logout)
        //     // For now, let's just log a message:
        //     console.log('User profile clicked');
        // }
    