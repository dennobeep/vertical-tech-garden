(function() {
    var loaded = 0;

    function allLoaded() {
        if (++loaded < 2) return;
        document.body.style.display = '';
    }

    var h = document.getElementById('header');
    var f = document.getElementById('footer');
    if (!h || !f) { document.body.style.display = ''; return; }

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
