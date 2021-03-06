import Checkbox from '../checkbox/checkbox.vue'
import Popover from '../popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSmileBeam } from '@fortawesome/free-regular-svg-icons'

library.add(faSmileBeam)

const ReactButton = {
  props: ['status'],
  data () {
    return {
      filterWord: '',
      keepReactOpen: false
    }
  },
  components: {
    Popover,
    Checkbox
  },
  methods: {
    addReaction (event, emoji, close, keepReactOpen) {
      const existingReaction = this.status.emoji_reactions.find(r => r.name === emoji)
      if (existingReaction && existingReaction.me) {
        this.$store.dispatch('unreactWithEmoji', { id: this.status.id, emoji })
      } else {
        this.$store.dispatch('reactWithEmoji', { id: this.status.id, emoji })
      }
      this.keepReactOpen = keepReactOpen
      if (!keepReactOpen) {
        close()
      }
    },
    focusInput () {
      this.$nextTick(() => {
        const input = this.$el.querySelector('input')
        if (input) input.focus()
      })
    }
  },
  computed: {
    commonEmojis () {
      return [
        { displayText: 'lying', replacement: 'π€₯' },
        { displayText: 'thinking', replacement: 'π€' },
        { displayText: 'zany', replacement: 'π€ͺ' },
        { displayText: 'cartwheeling', replacement: 'π€ΈββοΈ' },
        { displayText: 'pills', replacement: 'π' },
        { displayText: 'writing', replacement: 'βοΈ' },
        { displayText: 'pencil', replacement: 'βοΈ' },
        { displayText: 'chart_up', replacement: 'π' },
        { displayText: 'chart_down', replacement: 'π' },
        { displayText: 'question', replacement: 'β' },
        { displayText: 'x', replacement: 'β' },
        { displayText: 'orangutan', replacement: 'π¦§' },
        { displayText: 'owl', replacement: 'π¦' },
        { displayText: 'bottle', replacement: 'πΌ' },
        { displayText: 'crayon', replacement: 'ποΈ' },
        { displayText: 'blackula', replacement: 'π§πΏ' },
        { displayText: 'wrench', replacement: 'π§' },
        { displayText: 'axe', replacement: 'πͺ' }
      ]
    },
    emojis () {
      if (this.filterWord !== '') {
        const filterWordLowercase = this.filterWord.toLowerCase()
        let orderedEmojiList = []
        for (const emoji of this.$store.state.instance.emoji) {
          if (emoji.replacement === this.filterWord) return [emoji]

          const indexOfFilterWord = emoji.displayText.toLowerCase().indexOf(filterWordLowercase)
          if (indexOfFilterWord > -1) {
            if (!Array.isArray(orderedEmojiList[indexOfFilterWord])) {
              orderedEmojiList[indexOfFilterWord] = []
            }
            orderedEmojiList[indexOfFilterWord].push(emoji)
          }
        }
        return orderedEmojiList.flat()
      }
      return this.$store.state.instance.emoji || []
    },
    mergedConfig () {
      return this.$store.getters.mergedConfig
    }
  }
}

export default ReactButton
