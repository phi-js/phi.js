https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/


const colorScheme = useColorScheme()

colorScheme.set(newValue)

colorScheme.isDark (computed: bool)

/*
A list of all available schemes
[
  {
    text: 'Auto (light)',
    value: 'auto',
    enabled: true
  },
  {
    text: 'Light mode',
    value: 'light',
    enabled: false
  },
  {
    text: 'Dark mode',
    value: 'dark',
    enabled: false
  },
]
*/
colorScheme.available