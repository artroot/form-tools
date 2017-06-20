	function mark(mark, el){
		if (!event.target || !el || !mark) return;
		if (event.target == el && event.type == 'mouseover') {
			if (mark[0]) {
				mark.forEach(function (one) {
						one.style['background-color'] = 'red';
				});
			}else mark.style['background-color'] = 'red';
			el.style.outline = '1px solid red';
		}
		else {
			if (mark[0]) {
				mark.forEach(function (one) {
						one.style['background-color'] = null;
				});
			}else mark.style['background-color'] = null;
			el.style.outline = 'none';
		}
	}