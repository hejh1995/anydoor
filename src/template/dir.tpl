<!DOCTYPE html>
<html lang ="en">
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <style>
  body {
    margin: 30px;
  }
  a {
    display: inline-block;
    margin: 20px;
    text-decoration: none;
    color: #000;
  }
  </style>
</head>
<body>
{{#each files}}
<!-- 因为 进来后，与files在同一级，用 ../dir 会到上一级然后才能拿到dir -->
  <a href="{{../dir}}/{{file}}">[{{icon}}]----{{file}}</a>
{{/each}}
</body>
</html>
