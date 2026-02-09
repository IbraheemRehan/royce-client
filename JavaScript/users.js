document.getElementById('btn-login').addEventListener('click', function(e){
    e.preventDefault();
    
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(!fname || !lname || !email || !password){
        alert('Please fill all fields.');
        return;
    }

    const success = addUser(fname, lname, email, password);
    if(!success){
        alert('Email already registered!');
        return;
    }

    alert('Account created successfully! You can now login.');
    window.location.href = "login.html"; // redirect to login
});
