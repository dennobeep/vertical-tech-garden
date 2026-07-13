(function() {
    var loaded = 0;

    function allLoaded() {
        if (++loaded < 2) return;
        var body = document.body;
        var hidden = body.style.display;
        body.style.display = '';
        var s = document.createElement('script');
        s.src = 'js/main.js?v=4';
        s.async = false;
        body.appendChild(s);
    }

    var h = document.getElementById('header');
    var f = document.getElementById('footer');
    if (!h || !f) { allLoaded(); allLoaded(); return; }

    document.body.style.display = 'none';

    fetch('includes/header.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            h.innerHTML = html;
            allLoaded();
        });

    fetch('includes/footer.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            f.innerHTML = html;
            allLoaded();
        });
})();
