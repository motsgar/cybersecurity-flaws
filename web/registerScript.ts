import { hashPassword } from "./utils";

const registerForm = document.getElementById('register-form')! as HTMLFormElement;

const register = async (username: string, password: string) => {
    const hashedPassword = hashPassword(password);
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
    });
    if (response.status === 401) {
        response.text().then((text) => {
            alert(text);
        });
        return false;
    }
    return true;
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (document.getElementById('username')! as HTMLInputElement).value;
    const password = (document.getElementById('password')! as HTMLInputElement).value;
    const success = await register(username, password);
    if (success) {
        window.location.href = '/';
    }
});

fetch('/api/isLogged').then((response) => {
    if (response.status === 200) {
        window.location.href = '/';
    }
});