/**
 *
 * 配套视频教程请移步微信->小程序->灵动云课堂
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @link http://blog.it577.net
 * @author 黄秀杰
 */

const { jsonify } = require('../../../utils/index');
const AV = require('../../../utils/av-weapp.js')
const WxNotificationCenter = require('../../../utils/WxNotificationCenter.js')

Page({
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
	onShow: function () {
		this.loadData();
	},
	onLoad: function(options) {
		if (options.isSwitchAddress) {
			this.setData({
				isSwitchAddress: options.isSwitchAddress
			})
		}
	},
	setDefault: function (e) {
		// 设置为默认地址
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 遍历所有地址对象设为非默认
		var addressObjects = that.data.addressObjects;
		addressObjects = addressObjects.map(function (address, i) {
			address = AV.Object.createWithoutData('Address', address.objectId)
			// 判断是否为当前地址，是则传true
			address.set('isDefault', i == index)
			return address
		})
		// 提交网络更新该用户所有的地址
		AV.Object.saveAll(addressObjects).then(function (addressObjects) {
			// 成功同时更新本地数据源
			that.loadData()
			// 设置成功提示
			wx.showToast({
				title: '设置成功',
				icon: 'success',
				duration: 2000
			});
		}, function (error) {
			// 异常处理
		});
	},
	edit: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 取出id值
		var objectId = this.data.addressObjects[index].get('objectId');
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		});
	},
	delete: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 找到当前地址AVObject对象
		var address = that.data.addressObjects[index];
		// 给出确认提示框
		wx.showModal({
			title: '确认',
			content: '要删除这个地址吗？',
			success: function (res) {
				if (res.confirm) {
					// 真正删除对象
					address.destroy().then(function (success) {
						// 删除成功提示
						wx.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 2000
						});
						// 重新加载数据
						that.loadData();
					}, function (error) {

					});
				}
			}
		})

	},
	loadData: function () {
		// 加载网络数据，获取地址列表
		var that = this;
		var query = new AV.Query('Address');
		query.equalTo('user', AV.User.current());
		query.find().then(function (addressObjects) {
			that.setData({
				addressObjects: jsonify(addressObjects)
			});
		});
	},
	selectAddress: function (e) {
		if (!this.data.isSwitchAddress) {
			return;
		}
		var index = e.currentTarget.dataset.index;
		WxNotificationCenter.postNotificationName("addressSelectedNotification", this.data.addressObjects[index]);
		wx.navigateBack();
	},
})