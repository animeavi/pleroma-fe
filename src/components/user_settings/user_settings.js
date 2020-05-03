import get from 'lodash/get'
import map from 'lodash/map'
import reject from 'lodash/reject'
import Autosuggest from '../autosuggest/autosuggest.vue'
import TabSwitcher from '../tab_switcher/tab_switcher.js'
import BlockCard from '../block_card/block_card.vue'
import MuteCard from '../mute_card/mute_card.vue'
import DomainMuteCard from '../domain_mute_card/domain_mute_card.vue'
import SelectableList from '../selectable_list/selectable_list.vue'
import ProgressButton from '../progress_button/progress_button.vue'
import Importer from '../importer/importer.vue'
import Exporter from '../exporter/exporter.vue'
import withSubscription from '../../hocs/with_subscription/with_subscription'
import Checkbox from '../checkbox/checkbox.vue'

const BlockList = withSubscription({
  fetch: (props, $store) => $store.dispatch('fetchBlocks'),
  select: (props, $store) => get($store.state.users.currentUser, 'blockIds', []),
  childPropName: 'items'
})(SelectableList)

const MuteList = withSubscription({
  fetch: (props, $store) => $store.dispatch('fetchMutes'),
  select: (props, $store) => get($store.state.users.currentUser, 'muteIds', []),
  childPropName: 'items'
})(SelectableList)

const DomainMuteList = withSubscription({
  fetch: (props, $store) => $store.dispatch('fetchDomainMutes'),
  select: (props, $store) => get($store.state.users.currentUser, 'domainMutes', []),
  childPropName: 'items'
})(SelectableList)

const UserSettings = {
  data () {
    return {
      activeTab: 'profile',
      newDomainToMute: ''
    }
  },
  created () {
    this.$store.dispatch('fetchTokens')
  },
  components: {
    TabSwitcher,
    BlockList,
    MuteList,
    DomainMuteList,
    BlockCard,
    MuteCard,
    DomainMuteCard,
    ProgressButton,
    Autosuggest,
    Checkbox
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    pleromaBackend () {
      return this.$store.state.instance.pleromaBackend
    },
    currentSaveStateNotice () {
      return this.$store.state.interface.settings.currentSaveStateNotice
    }
  },
  methods: {
    importFollows (file) {
      return this.$store.state.api.backendInteractor.importFollows({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    importBlocks (file) {
      return this.$store.state.api.backendInteractor.importBlocks({ file })
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    generateExportableUsersContent (users) {
      // Get addresses
      return users.map((user) => {
        // check is it's a local user
        if (user && user.is_local) {
          // append the instance address
          // eslint-disable-next-line no-undef
          return user.screen_name + '@' + location.hostname
        }
        return user.screen_name
      }).join('\n')
    },
    activateTab (tabName) {
      this.activeTab = tabName
    },
    filterUnblockedUsers (userIds) {
      return reject(userIds, (userId) => {
        const user = this.$store.getters.findUser(userId)
        return !user || user.statusnet_blocking || user.id === this.$store.state.users.currentUser.id
      })
    },
    filterUnMutedUsers (userIds) {
      return reject(userIds, (userId) => {
        const user = this.$store.getters.findUser(userId)
        return !user || user.muted || user.id === this.$store.state.users.currentUser.id
      })
    },
    queryUserIds (query) {
      return this.$store.dispatch('searchUsers', query)
        .then((users) => map(users, 'id'))
    },
    blockUsers (ids) {
      return this.$store.dispatch('blockUsers', ids)
    },
    unblockUsers (ids) {
      return this.$store.dispatch('unblockUsers', ids)
    },
    muteUsers (ids) {
      return this.$store.dispatch('muteUsers', ids)
    },
    unmuteUsers (ids) {
      return this.$store.dispatch('unmuteUsers', ids)
    },
    unmuteDomains (domains) {
      return this.$store.dispatch('unmuteDomains', domains)
    },
    muteDomain () {
      return this.$store.dispatch('muteDomain', this.newDomainToMute)
        .then(() => { this.newDomainToMute = '' })
    },
    identity (value) {
      return value
    }
  }
}

export default UserSettings
