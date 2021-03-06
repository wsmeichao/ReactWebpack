import React from 'react';
import MIcon from './MIcon';
import classNames from 'classnames';
import {ComponentTool} from '../Tool/ComponentTool';

/*
*	调用方式： <MBackTop onClick={this._callback} className={'demoClass'}/>
*
*	----------------------------------------------------------------------
*	|  参数		|	      说明	  	   |      类型	   |      默认值	 |
*	----------------------------------------------------------------------
*	|  onClick  |       回调函数 	   |    function   |				 |
*	----------------------------------------------------------------------
*	| className |    用户自定义样式    |     string    | 				 |
*	----------------------------------------------------------------------
*/
class MBackTop extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			InTop: ''
		};
		[
			'_reqAnimFrame',
			'_setScrollTop',
			'_easeInOutCubic',
	    	'_handleScroll',
	        '_backTop',
	        '_currentScrollTop',
	        '_toTop',
	    ].forEach(func=>{
	        this[func] = this[func].bind(this);
	    });
	}
	_reqAnimFrame(callback){
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		requestAnimationFrame(callback);
	}
	_setScrollTop(value){
		document.body.scrollTop = value;
    	document.documentElement.scrollTop = value;

	}
	/*
	*	这公式有毒,暂时没明白如何计算出来的(仿照ant-design的源码的算法公式)
	*	@ t   时间差
	*	@ b   当前scrollTop
	*	@ c   
	*/
	_easeInOutCubic(t, b, c, d){
		const cc = c - b;
		t /= d / 2;
		if (t < 1) {
			return cc / 2 * t * t * t + b;
		} else {
			return cc / 2 * ((t -= 2) * t * t + 2) + b;
		}
	}
	_backTop(e){
		this.props.onClick?this.props.onClick():"";
		this._toTop(e);
	}
	_currentScrollTop(){
		return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
	}
	_toTop(){
		let self = this;
		const scrollTop = self._currentScrollTop();
		const startTime = Date.now();
		const frameFunc = () => {
	    	const timestamp = Date.now();
	    	const time = timestamp - startTime;
	    	self._setScrollTop(self._easeInOutCubic(time, scrollTop, 0, 250));
	    	if (time < 250) {
	        	self._reqAnimFrame(frameFunc);
	    	}
	    };
	    self._reqAnimFrame(frameFunc);
	}
	_handleScroll(e){
	    let scrollTop = this._currentScrollTop();
		let InTop = this.state.InTop;
	    if(scrollTop > 0){
	    	if(InTop == ''){
	    		InTop = 'M-in-top';
	    	}	    			
	    }else{
	    	InTop = '';
	    }
	    this.setState({
			InTop: InTop
		});
	}
	componentDidMount() {
		ComponentTool.bind(window,'scroll',this._handleScroll);
	}
	componentWillUnmount() {
		ComponentTool.unbind(window,'scroll',this._handleScroll);
	}
	render(){
		return (
			<div className = {classNames('M-back-top',this.state.InTop,this.props.className)} onClick = {this._backTop}>
				<MIcon type="arrowup" />
			</div>
		)
	}
}
module.exports = MBackTop;