const getUser_data = () => {
    if ((data = window.location.href.split("?")[1])) {
        window.history.pushState({}, null, window.location.href.split("?")[0]);

        localStorage.setItem("isLogged", true);
        return data
            .replace("user_data=", "")
            .replaceAll("%22", "")
            .replace("]", "")
            .replace("[", "");
    } else {
        localStorage.setItem("isLogged", false);
        return "";
    }
};
localStorage.setItem("user_data", getUser_data());
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
