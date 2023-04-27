const users = [
    {
        id: "1",
        email: "admin@admin.com",
        password: "$2a$12$h/uGVKLRQMRW3.Z2n9.YwuDrtnn9PUNwE.bl6GMaOcmBgHFQhGQvW",

    },
    {
        id: "2",
        email: "user@user.com",
        password: "$2a$12$h/uGVKLRQMRW3.Z2n9.YwuDrtnn9PUNwE.bl6GMaOcmBgHFQhGQvW",
    }
];

module.exports = {
    users,
    login: function(req, res) {
        return res.render("sign-in", { message: req.flash('error'), success: req.flash('success')[0] });
    },
    signIn: function(req, res) {
      
        const {body} = req
        const email = body?.email
        const password = body?.password

        if(!email){
            return req.flash('error', 'Campo de E-mail é obrigatório!')
        }

        if(!password){
            return req.flash('error', 'Campo de password é obrigatório!')
        }

        const user = users.find((user) => user.email === email) 
        if(!user){
            return req.flash('error', 'Usuário não existe na plataforma!')
        }
        const isPasswordMatching = password === user.password
        if(!isPasswordMatching){
            return req.flash('error', 'Senha incorreta!')
        }
        return res.redirect('/events')
    },
    createAccount: function(req, res) {
        return res.render('sign-up')
    },
    signUp: function(req, res) {
        return res.redirect('/events')
    }
}