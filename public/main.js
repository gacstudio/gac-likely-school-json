let theme = localStorage.getItem('data-theme');
document.documentElement.setAttribute("data-theme", theme);

const changeThemeToDark = () => {
    document.documentElement.setAttribute("data-theme", "dark") // set theme to dark
    localStorage.setItem("data-theme", "dark") // save theme to local storage
}

const changeThemeToLight = () => {
    document.documentElement.setAttribute("data-theme", "light") // set theme light
    localStorage.setItem("data-theme", 'light') // save theme to local storage
}

// Get the element based on ID
const checkbox = document.getElementById("switch");
// Apply retrived them to the website
checkbox.addEventListener('change', () => {
    let theme = localStorage.getItem('data-theme'); // Retrieve saved them from local storage
    if (theme ==='dark'){
        changeThemeToLight();
        document.getElementById("switch").classList.remove("ic-sun");
        document.getElementById("switch").classList.add("ic-moon");
    }else{
        changeThemeToDark();
        document.getElementById("switch").classList.remove("ic-moon");
        document.getElementById("switch").classList.add("ic-sun");
    }   
});
if(theme=="dark"){
    document.getElementById("switch").checked = true;
    document.getElementById("switch").classList.remove("ic-moon");
    document.getElementById("switch").classList.add("ic-sun");
}