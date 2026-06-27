import PropTypes from "prop-types";

function UniverseSearchIcon({ translate, toggleUniverseSearch }) {
	return (
		<li className="rbx-navbar-right-search">
			<button
				type="button"
				className="rbx-menu-item btn-navigation-nav-search-white-md"
				aria-label={translate("Label.sSearch")}
				onClick={toggleUniverseSearch}
			>
				<span className="icon-nav-search-white" aria-hidden="true" />
			</button>
		</li>
	);
}

UniverseSearchIcon.propTypes = {
	translate: PropTypes.func.isRequired,
	toggleUniverseSearch: PropTypes.func.isRequired,
};
export default UniverseSearchIcon;
