<template>
    <div class="input" :class="{'has-unit': hasUnit}">
        <input @click="selectAll()" @focus="valueFocused = true" @blur="valueFocused = false" @dragstart.prevent @mousedown="valueMouseDown($event)" ref="input" type="number" class="number-input" v-model="value_">
        
        <div class="unit" ref="unit" @dragstart.prevent @mousedown="unitMouseDown($event)" v-if="hasUnit">
            <span v-show="units[unit_] !== 'auto'">{{units[unit_]}}</span>
            <span v-show="units[unit_] === 'auto'">-</span>
        </div>

        <div class="unit-wheel" @dragstart.prevent v-show="isUnitMouseDown" v-if="hasUnit">
            <div class="center">{{units[unit_]}}</div>
            <div class="knob" :style="'transform: rotate('+(-1)*unitDeg+'deg)'"></div>

            <div class="item right"         :class="{'selected': unit_ == 0}">{{units[0]}}</div>
            <div class="item top-right"     :class="{'selected': unit_ == 1}">{{units[1]}}</div>
            <div class="item top"           :class="{'selected': unit_ == 2}">{{units[2]}}</div>
            <div class="item top-left"      :class="{'selected': unit_ == 3}">{{units[3]}}</div>
            <div class="item left"          :class="{'selected': unit_ == 4}">{{units[4]}}</div>
            <div class="item bottom-left"   :class="{'selected': unit_ == 5}">{{units[5]}}</div>
            <div class="item bottom"        :class="{'selected': unit_ == 6}">{{units[6]}}</div>
            <div class="item bottom-right"  :class="{'selected': unit_ == 7}">{{units[7]}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            value: {},
            label: {
                type: String
            },
            max: {
                type: Number,
                default: 999999
            },
            min: {
                type: Number,
                default: 0
            },
            nounit: {
                type: Boolean
            }
        },
        data() {
            return {
                hasUnit: true,
                
                valueFocused: false,
                isValueMouseDown: false,
                isValueDragging: false,
                valueStart: 0,
                value_: 0,
                valueTemp: 0,

                unitFocused: false,
                units: ['cm','auto','px','%','vm','vh','em','vmin'],
                unit_: 2,
                isUnitMouseDown: false,
                unitStartX: 0,
                unitStartY: 0,
                unitDeg: 0,
                unitLen: 0,
            }
        },
        mounted() {
            const vm = this

            window.addEventListener('mousemove', function(event) {
                vm.valueMouseMove(event)
                vm.unitMouseMove(event)
            }, false)

            window.addEventListener('mouseup', function(event) {
                vm.valueMouseUp(event)
                vm.unitMouseUp(event)
            }, false)

            if( this.nounit || this.nounit !== undefined && this.nounit !== false )
            {
                this.hasUnit = false
            }
        },
        watch: {
            value() {
                if( this.hasUnit )
                {
                    this.value_ = parseInt(this.value.value)
                }
                else
                {
                    this.value_ = parseInt(this.value)
                }
                
            },
            value_() {
                this.limitValue_()

                let ret = this.hasUnit ? {value: this.value_, unit: this.units[this.unit_]} : this.value_

                if( this.valueFocused || this.unitFocused ){
                    this.$emit('input', ret)
                }
            }
        },
        methods: {
            valueMouseDown(event) {
                this.isValueMouseDown = true
                this.valueFocused = true
                this.valueStart = event.clientY
            },

            unitMouseDown(event) {
                this.isUnitMouseDown = true
                this.unitFocused = true
                
                this.unitStartX = event.clientX - event.offsetX + this.$refs.unit.clientWidth / 2
                this.unitStartY = event.clientY - event.offsetY + this.$refs.unit.clientHeight / 2
            },



            valueMouseMove(event) {
                if( this.isValueMouseDown )
                {
                    
                    if( !this.isValueDragging && Math.abs(this.valueStart - event.clientY) > 25 )
                    {
                        this.isValueDragging = true
                        this.valueStart = event.clientY
                        this.valueTemp = parseInt(this.value_)
                    }

                    if( this.isValueDragging )
                    {
                        this.valueFocused = true
                        this.value_ = this.valueTemp + Math.round((this.valueStart - event.clientY) * .4)
                    }
                }
            },

            unitMouseMove(event) {
                if( this.isUnitMouseDown )
                {
                    let diffX = this.unitStartX - event.clientX
                    let diffY = this.unitStartY - event.clientY
                    let itemDeg = 360 / this.units.length

                    // this is just pythagoras - dont worry
                    this.unitLen = Math.floor(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) ))
                    this.unitDeg = Math.floor(Math.atan2(diffY, diffX) / Math.PI * 180) * (-1) + 180

                    this.unitFocused = true

                    if( this.unitLen > 30 )
                    {
                        let deg = this.unitDeg

                        deg += itemDeg / 2
                        if( deg > 360 ) deg -= 360
                        this.unit_ = (deg - deg % itemDeg) / itemDeg
                    }

                }
            },



            valueMouseUp() {
                this.isValueMouseDown = false
                this.valueFocused = false

                if( this.isValueDragging )
                {
                    this.$refs.input.blur()
                    this.isValueDragging = false
                }
            },

            unitMouseUp() {
                this.unitFocused = false
                this.isUnitMouseDown = false
            },



            selectAll() {
                // TODO: check if already has focus
                this.$refs.input.select()
            },

            limitValue_() {
                if( this.value_ > this.max ) this.value_ = this.max
                else if( this.value_ < this.min ) this.value_ = this.min
            },
        },
    }
</script>
<style lang="sass" scoped>
    .input
        --h: 30px
        --br: 5px
        height: var(--h)
        width: 130px
        background: #eee
        border-radius: var(--br)
        position: relative
        text-align: right
        vertical-align: top
        
        .number-input
            width: 100%
            height: var(--h)
            line-height: var(--h)
            background: transparent
            border-radius: var(--br)
            border: none
            color: var(--color-bright)
            font-weight: 700
            font-size: 13px
            letter-spacing: 1px
            font-family: 'Muli'
            vertical-align: top
            text-align: inherit
            padding-left: 10px
            padding-right: 10px

        &.has-label
            .number-input
                padding-left: 24px

        &.has-unit
            .number-input
                padding-right: 0px
                width: calc(100% - 44px)

        .unit
            width: 44px
            line-height: calc(var(--h) + 1px)
            height: var(--h)
            text-align: center
            font-size: 10px
            text-transform: uppercase
            letter-spacing: 1px
            padding-left: 1px
            color: var(--color-light)
            font-weight: 800
            border-radius: var(--br)
            user-select: none
            vertical-align: top
            position: relative
            cursor: default

        .unit-wheel
            height: 140px
            width: 140px
            border-radius: 100%
            background: var(--dark-background)
            position: absolute
            top: 50%
            right: 22px
            transform: translate(50%, -50%)
            z-index: 1
            filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.3))
            user-select: none

            &::after
                content: ''
                height: 60px
                width: 60px
                border-radius: 100%
                background: var(--darker-background)
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)

            .knob
                height: 0
                width: 0
                position: absolute
                left: 50%
                top: 50%

                &::after
                    content: ''
                    height: 6px
                    width: 6px
                    border-radius: 3px
                    background: var(--color-bright)
                    position: absolute
                    top: -3px
                    left: 24px
            
            .center
                width: 60px
                text-align: center
                height: 40px
                line-height: 40px
                font-size: 13px
                font-weight: 800
                position: absolute
                left: 50%
                top: 50%
                color: var(--color-bright)
                transform: translate(-50%, -50%)
                text-transform: uppercase

            .item
                height: 20px
                line-height: 20px
                font-size: 9px
                font-weight: 300
                letter-spacing: 1px
                position: absolute
                z-index: 1
                color: var(--color-light)
                text-transform: uppercase

                &.selected
                    color: var(--blue)
                    font-size: 11px
                    font-weight: 800

                &.top
                    top: 10px
                    left: 50%
                    transform: translateX(-50%)

                &.top-left
                    top: 26%
                    left: 23%
                    transform: translate(-50%, -50%)

                &.left
                    top: 50%
                    left: 0
                    transform: translateY(-50%)
                    width: 40px
                    text-align: center

                &.bottom-left
                    bottom: 26%
                    left: 23%
                    transform: translate(-50%, 50%)

                &.bottom
                    bottom: 10px
                    left: 50%
                    transform: translateX(-50%)

                &.bottom-right
                    bottom: 26%
                    right: 23%
                    transform: translate(50%, 50%)

                &.right
                    top: 50%
                    right: 0
                    transform: translateY(-50%)
                    width: 40px
                    text-align: center

                &.top-right
                    top: 26%
                    right: 23%
                    transform: translate(50%, -50%)
</style>