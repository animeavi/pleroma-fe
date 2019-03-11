import Status from '../status/status.vue'
import Conversation from '../conversation/conversation.vue'

const statusOrConversation = {
  props: ['statusoid'],
  data () {
    return {
      expanded: false,
      replying: false
    }
  },
  components: {
    Status,
    Conversation
  },
  methods: {
    toggleExpanded () {
      this.expanded = !this.expanded
    },
    toggleReplying () {
      this.replying = !this.replying
    }
  }
}

export default statusOrConversation
