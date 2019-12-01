$(document).ready(function(){
    $('.del').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log($target.attr('data-id'));
        console.log("Hello");
        $.ajax({
            type:'DELETE',
            url: '/blog/' + id,
            success: function(response){
                alert('Deleting Article')
                window.location.href = '/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

const sideNav = document.querySelector('.sidenav');
    M.Sidenav.init(sideNav,{});