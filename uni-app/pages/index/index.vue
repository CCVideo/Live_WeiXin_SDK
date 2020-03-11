<template>
	<view class="content">
		<view v-bind:class="main">
			<live-player class="live-player" id="player" :src="playerUrl" mode="live" autoplay />
		</view>
		<view v-bind:class="sub">
			<drawing-board v-if="render" class="drawing-board" v-bind:width="docWidth" v-bind:height="docHeight"></drawing-board>
		</view>
		<button class="btn" v-on:click=handleClick>切换文档视频</button>
		<!-- <view class="info">{{playerUrl}}</view> -->
	</view>
</template>

<script>
	var ccsdk = requirePlugin('ccsdk');

	export default {
		data() {
			return {
				playerUrl: '',
				toggle: true,
				render: true
			}
		},
		computed: {
			main() {
				return this.toggle ? "max" : "min"
			},
			sub() {
				return this.toggle ? "min" : "max"
			},
			docWidth() {
				return this.toggle ? "300rpx" : "100%"
			},
			docHeight() {
				return this.toggle ? "211rpx" : "423rpx"
			}
		},
		onLoad() {
			console.log(ccsdk)

			var self = this;
			ccsdk.live.init({
				userId: 'B693062ABB8020E0',
				roomId: '20E2BEC88BEF3EEB9C33DC5901307461',
				userName: 'hello',
				password: '',
				wx: wx,
				success(res) {
					console.log('登录成功回调', res);
					self.login()
				},
				fail(res) {
					console.log('登录失败回调', res);
				}
			});
			// this.ctx = ccsdk.live.configLivePlayer(this, wx);
		},
		methods: {
			login() {
				// var self = this
				// this.$nextTick(function(){
				// 	ccsdk.live.getPlayerUrls({
				// 	 success: function(datas) {
				// 	     // datas 流地址信息
				// 		 console.log(datas)
				// 		 self.playerUrl = datas.host[0]
				// 	 },
				// 	 fail: function(error) {
				// 	 }
				// 	})
				// })
				this.ctx = ccsdk.live.configLivePlayer(this, wx);
			},
			
			// 这里需要添加setData方法，data为返回值，返回对象 playerUrl 字段为播放地址
			
			setData(data) {
				console.log(data)
				this.playerUrl = data.playerUrl
			},
			handleClick() {
				this.toggle = !this.toggle
				// 通过 v-if 可以重制刷新文档组件，但是隐藏和显示两行代码需要有一个间隔，可以添加$nextTick，或setTimeout解决
				this.render = false
				this.$nextTick(() => {
					this.render = true
				})
			}
		}
	}
</script>

<style>
	.content {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.max {
		position: absolute;
		top: 0;
		left: 0;
		height: 423rpx;
		width: 100%;
		border: 1px pink solid;
	}

	.min {
		position: absolute;
		top: 450rpx;
		left: 50rpx;
		height: 211rpx;
		width: 300rpx;
		border: 1px blue solid;
	}

	.btn {
		position: absolute;
		bottom: 250rpx;
		width: 100%;
	}

	.info {
		position: absolute;
		bottom: 100rpx;
		border: 1rpx green solid;
		padding: 10px;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal;
	}

	.live-player {
		width: 100%;
		height: 100%;
	}

	.drawing-board {
		width: 100%;
		height: 100%;
	}
</style>
