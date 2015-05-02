(function () {
	angular
		.module('app')
		.directive('animatedScroll', animatedScroll);

	function animatedScroll() {
		var directive = {
			link: link,
			restrict: 'EA'
		};
		return directive;

		function link(scope, element, attrs) {
			$(element).on('click', function (e) {

				// Prevent default anchor click behavior
				e.preventDefault();

				// Store hash
				var hash = this.hash;

				// Animate
				$('html, body').animate({
						scrollTop: $(hash).offset().top
					}, 300, function () {
						// When done, add hash to url (default click behaviour)
						window.location.hash = hash;
					}
				);

				// Fire navbar-toogle click (if is expanded and visible) to hide it
				$toggle = $("#navbar-toggle");
				if($toggle.attr('aria-expanded') && $toggle.css('display') != 'none') {
					$toggle.click();
				}

			});
		}
	}
})();