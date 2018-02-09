
export default class NavigationUtils {

  static navigateTo(newPage, currentComponent) {
    currentComponent.props.navigation.navigate(newPage)
  };

  // Will make sure that ripple effects from buttons are shown before navigating away.
  static navigateWithEffectsTo(newPage, currentComponent) {
    setTimeout(() => currentComponent.props.navigation.navigate(newPage), 1)
  };
}

