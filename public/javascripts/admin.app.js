$(document).ready(function() {
    $('.edit').click(function () {
        var child = $(this).children();
		child.toggleClass('fa-pencil-alt fa-check');
    });

    
});