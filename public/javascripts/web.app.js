$(function() {
    if(Cookies.get('lang') !== undefined) {
        $("[data-localize]").localize("/javascripts/language", {language: Cookies.get('lang') })
	 } else {
		 $("[data-localize]").localize("/javascripts/language", {language: "de" });
			Cookies.set('lang', 'DE');
	}
});

