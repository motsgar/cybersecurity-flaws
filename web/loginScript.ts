import { hashPassword } from "./utils";

const loginForm = document.getElementById('login-form')! as HTMLFormElement;

const login = async (username: string, password: string) => {
    const hashedPassword = hashPassword(password);
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
    });
    if (response.status === 401) {
        alert('Wrong username or password');
        return false;
    }
    return true;
}



loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (document.getElementById('username')! as HTMLInputElement).value;
    const password = (document.getElementById('password')! as HTMLInputElement).value;
    const success = await login(username, password);
    if (success) {
        window.location.href = '/';
    }
});

fetch('/api/isLogged').then((response) => {
    if (response.status === 200) {
        window.location.href = '/';
    }
});