/*
A lyrics sobject has the following properties:

text:
A full text containing the entire lyrics.
Newlines, spaces and "|" are interpreted as breakpoints.

e.g.
Once more we sail by the nor|thern gail
and boun|ding over the main
And not the hills of those tro|pic isles
we soon shall see a|gain

lines:
An array of LINE objects.
*/
export default {
  url: 'https://www.youtube.com/watch?v=sPXTm6g0ejg',

  text: `
Once more we sail by the north|ern gail
and boun|ding o|ver the main
And now the hills of those tro|pic isles
we soon shall see a|gain

Five hell|ish moons have waxed and waned
since from those shores sailed we
for now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui

Roll|ing down to Old Ma|ui, me boys
Roll|ing down to Old Ma|ui
For now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui

Through ma|ny a blow of frost and snow
and bi|tter squalls of hail
our spars were bent and our can|vas rent
as we braved the nor|thern gale

And the ho|rrid isled of ice cut tiles
that deck the arc|tic Sea
now lie ma|ny leages as|tern
as we sail to Old Ma|ui

Roll|ing down to Old Ma|ui, me boys
Roll|ing down to Old Ma|ui
For now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui

Oh wel|come the seas and the fra|grant breeze
that is la|den with o|dors rare
and the pre|tty maids in the su|nny glades
who are gen|tle, kind and fair

And their pre|tty eyes look to|wards the skies
ho|ping some day to see
our snow|-white sails be|fore the gales
roll|ing down to Old Ma|ui

Roll|ing down to Old Ma|ui, me boys
Roll|ing down to Old Ma|ui
For now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui

It's a damn tough life full of toil and strife
we whale|men un|der|go
And we don't give a damn
when the gails have stoped
how hard the wind did blow

We are home|ward bound, 'tis a glo|rious sound
on a good ship, taut and free
and we'll think of that as we drink and chat
with the girls of Old Ma|ui

Roll|ing down to Old Ma|ui, me boys
Roll|ing down to Old Ma|ui
For now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui

Roll|ing down to Old Ma|ui, me boys
Roll|ing down to Old Ma|ui
For now we're bound from the arc|tic ground
roll|ing down to Old Ma|ui
`,

  lines: [
    {
      words: [
        { timestamp: 3231, value: 'Once ' },
        { timestamp: 3383, value: 'more ' },
        { timestamp: 3796, value: 'we ' },
        { timestamp: 4195, value: 'sail ' },
        { timestamp: 4614, value: 'by ' },
        { timestamp: 4826, value: 'the ' },
        { timestamp: 5055, value: 'Nor' },
        { timestamp: 5494, value: 'thern ' },
        { timestamp: 5907, value: 'gale' },
      ],
    },
    {
      words: [
        { timestamp: 6336, value: 'And ' },
        { timestamp: 6759, value: 'boun' },
        { timestamp: 7163, value: 'ding ' },
        { timestamp: 7586, value: 'o' },
        { timestamp: 7816, value: 'ver ' },
        { timestamp: 8021, value: 'the ' },
        { timestamp: 8456, value: 'main' },
      ],
    },
    {
      words: [
        { timestamp: 9718, value: 'And ' },
        { timestamp: 10141, value: 'now ' },
        { timestamp: 10555, value: 'the ' },
        { timestamp: 10980, value: 'hills ' },
        { timestamp: 11403, value: 'of ' },
        { timestamp: 11621, value: 'those ' },
        { timestamp: 11844, value: 'tro' },
        { timestamp: 12239, value: 'pic ' },
        { timestamp: 12653, value: 'isles' },
      ],
    },
    {
      words: [
        { timestamp: 13070, value: 'We ' },
        { timestamp: 13486, value: 'soon ' },
        { timestamp: 13928, value: 'shall ' },
        { timestamp: 14344, value: 'see ' },
        { timestamp: 14755, value: 'a' },
        { timestamp: 15190, value: 'gain' },
      ],
    },
    {
      words: [
        { timestamp: 16458, value: 'Five ' },
        { timestamp: 16887, value: 'hell' },
        { timestamp: 17304, value: 'ish ' },
        { timestamp: 17717, value: 'moons ' },
        { timestamp: 18122, value: 'have ' },
        { timestamp: 18532, value: 'waxed ' },
        { timestamp: 18940, value: 'and ' },
        { timestamp: 19350, value: 'waned' },
      ],
    },
    {
      words: [
        { timestamp: 19813, value: 'Since ' },
        { timestamp: 20257, value: 'from ' },
        { timestamp: 20640, value: 'those ' },
        { timestamp: 21056, value: 'shores ' },
        { timestamp: 21485, value: 'sailed ' },
        { timestamp: 21917, value: 'we' },
      ],
    },
    {
      words: [
        { timestamp: 23201, value: 'For ' },
        { timestamp: 23618, value: 'now ' },
        { timestamp: 24068, value: 'we\'re ' },
        { timestamp: 24469, value: 'bound ' },
        { timestamp: 24892, value: 'from ' },
        { timestamp: 25097, value: 'the ' },
        { timestamp: 25306, value: 'arc' },
        { timestamp: 25728, value: 'tic ' },
        { timestamp: 26166, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: 26577, value: 'Roll' },
        { timestamp: 26782, value: 'ing ' },
        { timestamp: 27021, value: 'down ' },
        { timestamp: 27429, value: 'to ' },
        { timestamp: 27873, value: 'Old ', class: 'wOld' },
        { timestamp: 28317, value: 'Ma', class: 'wMa' },
        { timestamp: 28715, value: 'ui', class: 'wUi' },
      ],
    },
    // {
    //   words: [],
    // },
    {
      words: [
        { timestamp: 29573, value: 'Roll', class: 'wRoll' },
        { timestamp: 30014, value: 'ing ', class: 'wRoll' },
        { timestamp: 30437, value: 'down ', class: 'wRoll' },
        { timestamp: 31062, value: 'to ' },
        { timestamp: 31243, value: 'old ', class: 'wOld' },
        { timestamp: 31678, value: 'Ma', class: 'wMa' },
        { timestamp: 32082, value: 'ui, ', class: 'wUi' },
        { timestamp: 32686, value: 'me ', class: 'wMe' },
        { timestamp: 32894, value: 'boys', class: 'wBoys' },
      ],
    },
    {
      words: [
        { timestamp: 33308, value: 'Roll', class: 'wRoll' },
        { timestamp: 33528, value: 'ing ', class: 'wRoll' },
        { timestamp: 33779, value: 'down ', class: 'wRoll' },
        { timestamp: 34389, value: 'to ' },
        { timestamp: 34585, value: 'old ', class: 'wOld' },
        { timestamp: 35002, value: 'Ma', class: 'wMa' },
        { timestamp: 35434, value: 'ui', class: 'wUi' },
      ],
    },
    {
      words: [
        { timestamp: 36766, value: 'For ' },
        { timestamp: 37149, value: 'now ' },
        { timestamp: 37575, value: 'we\'re ' },
        { timestamp: 37986, value: 'bound ' },
        { timestamp: 38421, value: 'from ' },
        { timestamp: 38611, value: 'the ' },
        { timestamp: 38819, value: 'arc' },
        { timestamp: 39251, value: 'tic ' },
        { timestamp: 39677, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: 40115, value: 'Roll', class: 'wRoll' },
        { timestamp: 40299, value: 'ing ', class: 'wRoll' },
        { timestamp: 40495, value: 'down ', class: 'wRoll' },
        { timestamp: 40933, value: 'to ' },
        { timestamp: 41350, value: 'old ', class: 'wOld' },
        { timestamp: 41797, value: 'Ma', class: 'wMa' },
        { timestamp: 42235, value: 'ui', class: 'wUi' },
      ],
    },
    // {
    //   words: [],
    // },
    {
      words: [
        { timestamp: 43522, value: 'Through ' },
        { timestamp: 43984, value: 'ma' },
        { timestamp: 44370, value: 'ny ' },
        { timestamp: 44560, value: 'a ' },
        { timestamp: 44756, value: 'blow ' },
        { timestamp: 45213, value: 'of ' },
        { timestamp: 45602, value: 'frost ' },
        { timestamp: 46028, value: 'and ' },
        { timestamp: 46444, value: 'snow' },
      ],
    },
    {
      words: [
        { timestamp: 46876, value: 'And ' },
        { timestamp: 47296, value: 'bi' },
        { timestamp: 47722, value: 'tter ' },
        { timestamp: 48083, value: 'squalls ' },
        { timestamp: 48555, value: 'of ' },
        { timestamp: 48999, value: 'hail' },
      ],
    },
    {
      words: [
        { timestamp: 50485, value: 'Our ' },
        { timestamp: 50773, value: 'spars ' },
        { timestamp: 51184, value: 'were ' },
        { timestamp: 51570, value: 'bent ' },
        { timestamp: 51980, value: 'and ' },
        { timestamp: 52173, value: 'our ' },
        { timestamp: 52369, value: 'can' },
        { timestamp: 52807, value: 'vas ' },
        { timestamp: 53212, value: 'rent' },
      ],
    },
    {
      words: [
        { timestamp: 53616, value: 'As ' },
        { timestamp: 53843, value: 'we ' },
        { timestamp: 54061, value: 'braved ' },
        { timestamp: 54495, value: 'the ' },
        { timestamp: 54822, value: 'nor' },
        { timestamp: 55362, value: 'thern ' },
        { timestamp: 55736, value: 'gale' },
      ],
    },
    // {
    //   words: [],
    // },
    {
      words: [
        { timestamp: 56992, value: 'And ' },
        { timestamp: 57207, value: 'the ' },
        { timestamp: 57397, value: 'ho' },
        { timestamp: 57597, value: 'rrid ' },
        { timestamp: 57826, value: 'isles ' },
        { timestamp: 58668, value: 'of ' },
        { timestamp: 59112, value: 'ice ' },
        { timestamp: 59510, value: 'cut ' },
        { timestamp: 59909, value: 'tiles' },
      ],
    },
    {
      words: [
        { timestamp: 60359, value: 'That ' },
        { timestamp: 60791, value: 'deck ' },
        { timestamp: 61186, value: 'the ' },
        { timestamp: 61603, value: 'arc' },
        { timestamp: 62029, value: 'tic ' },
        { timestamp: 62473, value: 'sea' },
      ],
    },
    {
      words: [
        { timestamp: 63726, value: 'Now ' },
        { timestamp: 64565, value: 'lie ' },
        { timestamp: 65031, value: 'ma' },
        { timestamp: 65454, value: 'ny ' },
        { timestamp: 65861, value: 'leagues ' },
        { timestamp: 66299, value: 'as' },
        { timestamp: 66743, value: 'tern' },
      ],
    },
    {
      words: [
        { timestamp: 67163, value: 'As ' },
        { timestamp: 67365, value: 'we ' },
        { timestamp: 67595, value: 'sail ' },
        { timestamp: 67990, value: 'to ' },
        { timestamp: 68373, value: 'old ', class: 'wOld' },
        { timestamp: 68814, value: 'Ma', class: 'wMa' },
        { timestamp: 69271, value: 'ui', class: 'wUi' },
      ],
    },
    // {
    //   words: [],
    // },
    {
      words: [
        { timestamp: 70116, value: 'Roll', class: 'wRoll' },
        { timestamp: 70564, value: 'ing ', class: 'wRoll' },
        { timestamp: 71005, value: 'down ', class: 'wRoll' },
        { timestamp: 71627, value: 'to ' },
        { timestamp: 71841, value: 'old ', class: 'wOld' },
        { timestamp: 72276, value: 'Ma', class: 'wMa' },
        { timestamp: 72669, value: 'ui, ', class: 'wUi' },
        { timestamp: 73278, value: 'me ', class: 'wMe' },
        { timestamp: 73496, value: 'boys', class: 'wBoys' },
      ],
    },
    {
      words: [
        { timestamp: 73931, value: 'Roll', class: 'wRoll' },
        { timestamp: 74105, value: 'ing ', class: 'wRoll' },
        { timestamp: 74342, value: 'down ', class: 'wRoll' },
        { timestamp: 74935, value: 'to ' },
        { timestamp: 75138, value: 'old ', class: 'wOld' },
        { timestamp: 75591, value: 'Ma', class: 'wMa' },
        { timestamp: 76017, value: 'ui', class: 'wUi' },
      ],
    },
    {
      words: [
        { timestamp: 77307, value: 'For ' },
        { timestamp: 77720, value: 'now ' },
        { timestamp: 78152, value: 'we\'re ' },
        { timestamp: 78575, value: 'bound ' },
        { timestamp: 78998, value: 'from ' },
        { timestamp: 79179, value: 'the ' },
        { timestamp: 79415, value: 'arc' },
        { timestamp: 79828, value: 'tic ' },
        { timestamp: 80223, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: 80655, value: 'Roll', class: 'wRoll' },
        { timestamp: 80864, value: 'ing ', class: 'wRoll' },
        { timestamp: 81099, value: 'down ', class: 'wRoll' },
        { timestamp: 81510, value: 'to ' },
        { timestamp: 81933, value: 'old ', class: 'wOld' },
        { timestamp: 82368, value: 'Ma', class: 'wMa' },
        { timestamp: 82806, value: 'ui', class: 'wUi' },
      ],
    },
    // {
    //   words: [],
    // },
    {
      words: [
        { timestamp: null, value: 'Oh ' },
        { timestamp: null, value: 'welcome ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'seas ' },
        { timestamp: null, value: 'and ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'fragrant ' },
        { timestamp: null, value: 'breeze' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'That ' },
        { timestamp: null, value: 'is ' },
        { timestamp: null, value: 'laden ' },
        { timestamp: null, value: 'with ' },
        { timestamp: null, value: 'odors ' },
        { timestamp: null, value: 'rare' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'And ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'pretty ' },
        { timestamp: null, value: 'maids ' },
        { timestamp: null, value: 'in ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'sunny ' },
        { timestamp: null, value: 'glades' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Who ' },
        { timestamp: null, value: 'are ' },
        { timestamp: null, value: 'gentle, ' },
        { timestamp: null, value: 'kind ' },
        { timestamp: null, value: 'and ' },
        { timestamp: null, value: 'fair' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'And ' },
        { timestamp: null, value: 'their ' },
        { timestamp: null, value: 'pretty ' },
        { timestamp: null, value: 'eyes ' },
        { timestamp: null, value: 'look ' },
        { timestamp: null, value: 'towards ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'skies' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Hoping ' },
        { timestamp: null, value: 'some ' },
        { timestamp: null, value: 'day ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'see' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Our ' },
        { timestamp: null, value: 'snow-white ' },
        { timestamp: null, value: 'sails ' },
        { timestamp: null, value: 'before ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'gales' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui, ', class: 'wMa' },
        { timestamp: null, value: 'me ', class: 'wUi' },
        { timestamp: null, value: 'boys' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'For ' },
        { timestamp: null, value: 'now ' },
        { timestamp: null, value: 'we\'re ' },
        { timestamp: null, value: 'bound ' },
        { timestamp: null, value: 'from ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'arctic ' },
        { timestamp: null, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'It\'s ' },
        { timestamp: null, value: 'a ' },
        { timestamp: null, value: 'damn ' },
        { timestamp: null, value: 'tough ' },
        { timestamp: null, value: 'life ' },
        { timestamp: null, value: 'of ' },
        { timestamp: null, value: 'toil ' },
        { timestamp: null, value: 'and ' },
        { timestamp: null, value: 'strife' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'We ' },
        { timestamp: null, value: 'whalemen ' },
        { timestamp: null, value: 'undergo;' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'And ' },
        { timestamp: null, value: 'we ' },
        { timestamp: null, value: 'don\'t ' },
        { timestamp: null, value: 'give ' },
        { timestamp: null, value: 'a ' },
        { timestamp: null, value: 'damn' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'When ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'gails ' },
        { timestamp: null, value: 'have ' },
        { timestamp: null, value: 'stoped' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'How ' },
        { timestamp: null, value: 'hard ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'wind ' },
        { timestamp: null, value: 'did ' },
        { timestamp: null, value: 'blow' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'We ' },
        { timestamp: null, value: 'are ' },
        { timestamp: null, value: 'homeward ' },
        { timestamp: null, value: 'bound, ' },
        { timestamp: null, value: '\'tis ' },
        { timestamp: null, value: 'a ' },
        { timestamp: null, value: 'glorious ' },
        { timestamp: null, value: 'sound' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'On ' },
        { timestamp: null, value: 'a ' },
        { timestamp: null, value: 'good ' },
        { timestamp: null, value: 'ship, ' },
        { timestamp: null, value: 'taut ' },
        { timestamp: null, value: 'and ' },
        { timestamp: null, value: 'free' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'And ' },
        { timestamp: null, value: 'we\'ll ' },
        { timestamp: null, value: 'think ' },
        { timestamp: null, value: 'of ' },
        { timestamp: null, value: 'that ' },
        { timestamp: null, value: 'as ' },
        { timestamp: null, value: 'we ' },
        { timestamp: null, value: 'drink ' },
        { timestamp: null, value: 'and ' },
        { timestamp: null, value: 'chat' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'With ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'girls ' },
        { timestamp: null, value: 'of ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Mohee', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui, ', class: 'wMa' },
        { timestamp: null, value: 'me ', class: 'wUi' },
        { timestamp: null, value: 'boys' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'For ' },
        { timestamp: null, value: 'now ' },
        { timestamp: null, value: 'we\'re ' },
        { timestamp: null, value: 'bound ' },
        { timestamp: null, value: 'from ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'arctic ' },
        { timestamp: null, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui, ', class: 'wMa' },
        { timestamp: null, value: 'me ', class: 'wUi' },
        { timestamp: null, value: 'boys' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'For ' },
        { timestamp: null, value: 'now ' },
        { timestamp: null, value: 'we\'re ' },
        { timestamp: null, value: 'bound ' },
        { timestamp: null, value: 'from ' },
        { timestamp: null, value: 'the ' },
        { timestamp: null, value: 'arctic ' },
        { timestamp: null, value: 'ground' },
      ],
    },
    {
      words: [
        { timestamp: null, value: 'Rolling ' },
        { timestamp: null, value: 'down ' },
        { timestamp: null, value: 'to ' },
        { timestamp: null, value: 'old ', class: 'wOld' },
        { timestamp: null, value: 'Maui', class: 'wMa' },
      ],
    },
  ],
}