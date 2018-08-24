<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <style>
        *{
            font-size: 24px;
        }
        .auth,.size{
            margin-right: 20px;
            font-size: 16px;
        }
    </style>
</head>

<body>
    <ul>
        {{#each files}}
        <li>
         <span class="auth">{{auth}}</span> <span class="size">{{size}}</span> <a href="{{../dir}}/{{name}}">{{name}}</a>
        </li>
        {{/each}}
    </ul>
    <address>{{version}}/
        <a href="https://github.com/ViktorWong/nodeserver#readme">nodeserver</a> server running @ {{website}}</address>

</body>

</html>