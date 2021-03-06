const state = {
    loadDelay: 1100,
    releaseNote: false,
    preloader: true,
    settings: false,
    export: false,
    contextMenu: false,
    context: [0, 0],
    contextInfo: {context: null, uuid: null},
}

const getters = {
    loadDelay: (state) => state.loadDelay,
    contextMenu: (state) => state.context,
    contextInfo: (state) => state.contextInfo,
    contextMenuUI: (state) => state.contextMenu,
    releaseNoteUI: (state) => state.releaseNote,
    preloaderUI: (state) => state.preloader,
    settingsUI: (state) => state.settings,
    exportUI: (state) => state.export,
}

const actions = {

    setContextMenu({ commit }, payload)
    {
        if( typeof payload === 'object' )
        {
            commit('setContextMenu_', payload)
        }
    },

    setContextInfo({ commit }, payload)
    {
        if( typeof payload === 'object' )
        {
            commit('setContextInfo_', payload)
        }
    },

    setContextMenuUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setContextMenuUI_', payload)
        }
    },

    setReleaseNoteUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setReleaseNoteUI_', payload)
        }
    },

    setPreloaderUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setPreloaderUI_', payload)
        }
    },

    setSettingsUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setSettingsUI_', payload)
        }
    },

    setExportUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setExportUI_', payload)
        }
    },
}

const mutations = {

    setContextMenu_: (state, param) => {
        state.context = param
    },

    setContextInfo_: (state, param) => {
        state.contextInfo = param
    },

    setContextMenuUI_: (state, param) => {
        state.contextMenu = param
    },

    setReleaseNoteUI_: (state, param) => {
        state.releaseNote = param
    },

    setPreloaderUI_: (state, param) => {
        state.preloader = param
    },

    setSettingsUI_: (state, param) => {
        state.settings = param
    },

    setExportUI_: (state, param) => {
        state.export = param
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}