<html>

<head>
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('/external/css/style1.css') }}">
</head>

<body>
    <div class="split left">
        <div class="centered"></div>
    </div>

    <div class="split right">
        <div class="centered">
            <div class="loginbox">
                <img src="{{ asset('/external/img/logo.webp') }}" class="avatar">
                @if(Session::has('message'))
                    {{ Session::get('message') }}
                @endif
                <form action="{{ route('authenticate') }}" method="post">
                    @csrf
                    <input type="text" name="email" placeholder="Email Address" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <input type="submit" name="submit" value="Login">
                    <!-- <p>----------------&nbsp OR &nbsp-----------------</p>
                    <a href="#">Login With Gmail</a><br>
                    <a href="#">Forgot Password?</a><br>
                    <a href="#">Don't have an account?</a><br><br>
                    <input type="submit" name="" value="Sign Up">
                    <br><br> -->
                </form>
            </div>
        </div>
    </div>
</body>

</html>