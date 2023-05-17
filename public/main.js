const getUser_data = () => {
    if (window.location.href.split("/")[1]) {
        window.history.pushState({}, null, window.location.href.split("?")[0]);
        return window.location.href.split("?")[1];
    } else {
        return "";
    }
};
console.log("", user_data);

const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

toggleSwitch.addEventListener("change", switchTheme, false);
