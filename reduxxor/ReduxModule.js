var ReduxModule = function(params) {
	var {name, actionCreatorAbstract, reducers} = params;

	function getSuccessDispatch(dispatch) {
		return function(action) {
			return dispatch(Object.assign({type: name + '_SUCCESS'}, action));
		};
	}

	function getOptimisticDispatch(dispatch) {
		return function(action) {
			return dispatch(Object.assign({type: name + '_OPTIMISTIC'}, action));
		};
	}

	this.actionCreator = function(config, dispatch, params) {
		return actionCreatorAbstract(getOptimisticDispatch(dispatch), getSuccessDispatch(dispatch), Object.assign({}, params, {config, dispatch}));
	};

	this.reducer = {};
	if (reducers.successReducer) this.reducer[name + '_SUCCESS'] = reducers.successReducer;
	if (reducers.optimisticReducer) this.reducer[name + '_OPTIMISTIC'] = reducers.optimisticReducer;

	this.name = name;
};

export default ReduxModule;
