<template>
    <div class="background">
        <div class="container">
            <div class="title">Diagramm exportieren</div>
            <div class="row">
                <div class="name">Format:</div>
                <div class="input-container">
                    <!-- ToDo: Tex support -->
                    <drop-down class="export-method" :options="exportFormats" v-model="exportFormat"></drop-down>
                </div>
            </div>
            <div class="row">
                <div class="name">Skalierung:</div>
                <div class="input-container">
                    <drop-down class="export-scale" :options="exportScales" v-model="exportScale"></drop-down>
                </div>
            </div>
            <div class="row">
                <div class="name">Exportieren nach:</div>
                <div class="input-container max-width">
                    <div class="save-path" :title="exportPathPlaceholder">{{exportPathPlaceholder}}</div>
                    <div class="text-button" @click="chooseExportPath()">Ändern</div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="row">
                <div class="ghost-button" @click="setExportUI(false)">Abbrechen</div>
                <div class="button" @click="export_()">Exportieren</div>
            </div>
        </div>

        <!-- Renderer (not displayed on screen) -->
        <div class="render-container">
            <div id="render-root">
                <render-structure v-for="(child, i) in docStructures.children" :key="i" :trace="'N:'+i" :structure="child"></render-structure>
                <div class="placeholder rendered" v-show="docStructures.children.length == 0"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import Spinner from '../components/Spinner.vue'
    import RenderStructure from '../editor/components/RenderStructure'
    import DropDown from '../components/DropDown.vue'
    import { EventBus } from '../../assets/js/event-bus.js'
    import htmlToImage from 'html-to-image'

    export default {
        data() {
            return {
                exportFormat: 'PNG',
                exportFormats: {
                    'PNG': 'PNG',
                    'JPG': 'JPG',
                },
                exportScale: 1,
                exportScales: {
                    1: 'x1',
                    2: 'x2',
                    3: 'x3',
                    4: 'x4',
                }
            }
        },
        mounted() {
            EventBus.$on('export', () => {
                this.setExportUI(true)
            })
        },
        computed: {
            ...mapGetters([
                'exportPath',
                'docStructures',
            ]),

            exportPathPlaceholder() {
                let extension = '.' + this.exportFormat.toLowerCase()
                return this.exportPath ? this.exportPath + extension : 'Auswählen'
            }
        },
        methods: {
            ...mapActions([
                'setExportUI',
                'dataUrlToFile',
                'chooseExportPath',
            ]),

            async export_() {

                let renderRoot = document.getElementById('render-root')
                let dataUrl = null

                let options = {
                    width: renderRoot.offsetWidth * this.exportScale,
                    height: renderRoot.offsetHeight * this.exportScale,
                    style: {
                        transform: `scale(${this.exportScale})`,
                        transformOrigin: 'top left',
                    }
                }

                if (this.exportFormat === 'PNG')
                {
                    dataUrl = await htmlToImage.toPng(renderRoot, options)
                }
                else if (this.exportFormat === 'JPG')
                {
                    dataUrl = await htmlToImage.toJpeg(renderRoot, options)
                }

                this.dataUrlToFile({
                    dataUrl,
                    format: this.exportFormat,
                    path: this.exportPath,
                })

                this.setExportUI(false)
            }
        },
        components: {
            Spinner,
            DropDown,
            RenderStructure,
        }
    }
</script>
<style lang="sass" scoped>
    .render-container
        opacity: 0
        pointer-events: none

    #render-root
        padding: 15px
        background: white
        font-family: 'SCP', monospace
        position: relative

    .background
        z-index: 1000
        background: #00000070
        width: 100%
        height: 100%
        position: fixed
        top: 0
        left: 0

        .container
            width: 500px
            border-radius: 10px
            position: absolute
            top: 50%
            left: 50%
            padding: 30px
            padding-bottom: 20px
            text-align: left
            transform: translate(-50%, -50%)
            background: var(--background)

            .title
                width: 100%
                line-height: 20px
                padding-bottom: 5px
                margin-bottom: 20px
                border-bottom: 1px solid var(--color-lighter)
                text-align: left
                font-size: 14px
                font-weight: 800
                letter-spacing: 0.5px
                color: var(--color-bright)
                user-select: none

            .divider
                margin: 10px 0 20px
                width: 100%
                border-bottom: 1px solid var(--color-lighter)

            .row
                margin: 10px 0
                width: 100%
                text-align: left

                .button
                    float: right

                .ghost-button
                    margin-left: 15px
                    float: right

                .name
                    width: 110px
                    color: var(--color-light)
                    font-size: 11px
                    line-height: 20px
                    padding: 5px 0
                    font-weight: 600
                    letter-spacing: 0.3px
                    vertical-align: top
                    user-select: none

                .input-container
                    vertical-align: top

                    &.max-width
                        width: calc(100% - 110px)

                    .text-button
                        float: right

                    .export-method
                        width: 100px
                        text-align: left
                        background: none

                    .export-scale
                        width: 80px
                        text-align: left
                        background: none

                    .save-path
                        width: 220px
                        font-size: 12px
                        color: var(--color)
                        font-weight: 700
                        line-height: 30px
                        vertical-align: top
                        overflow: hidden
                        text-overflow: ellipsis
                        user-select: none
                        margin-right: 5px
                        padding: 0 10px
</style>