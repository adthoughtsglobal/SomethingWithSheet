let l = 0, s = [], sc = [], scv = [], ds = null, mode = 0, cr = false, f = 2, isNew = true, rc = 24;	//Variables
let cells = document.querySelectorAll('cell'), inputs = document.querySelectorAll('input');
let rn = [], cn = [], i = 0, txt = [], line = [[]];

isNew = getQueryParam("isNew"); if (isNew == "false") {isNew = false} else {isNew = true};
let r = parseInt(getQueryParam("row")), c = parseInt(getQueryParam("column")); 
function getQueryParam(name) {	//when jump from Menu.html
	const urlParams = new URLSearchParams(window.location.search); 
	if (isNew){
		return urlParams.get(name);
	} else {
		return 0;
	}
}

function getTableData () {
	if (isNew == false) {
		eel.load_from_json()().then(data => {	txt = data.txt;	line = data.line; //txt[n] is value of cell[line[n][0]].flip[line[n][1]]
			if ((r+c)==0) r = data.row.length, c = data.col.length;	//when direct open from startup
			Table();
			for (let L=0;L<r;L++) {
				rn[L].innerHTML = data.row[L];
			}
			for (let L=0;L<c;L++) {
				cn[L].innerHTML = data.col[L];
			}
		}).catch(error => {
			console.error("Error loading data:", error);
		});
	} else {
		Table();
	}
}
function Table() {
	const wheight = document.documentElement.clientHeight-32;
	const wwidth = document.documentElement.clientWidth-32;
	let Container = document.getElementById('main');	//container of row, col and table. instead of document.querySelectorAll, Container.getElementById is optimal
	Container.style.height = `${wheight}px`;
	Container.style.width = `${wwidth}px`;
	let table = document.getElementById('table');
	table.style.height = `${wheight-rc-6}px`;
	table.style.width = `${wwidth-rc-8}px`;
	for (let C=0;C<c;C++){
		let cl = document.createElement('div');
		cl.className = 'ce';
		cl.style.height = `${(wheight - 8 - rc) / c }px`;
		cl.style.width = `${rc}px`;
		document.getElementById('column').appendChild(cl);
	}
	document.getElementById('column').style.height = `${wheight - 24}px`;
	cn = Container.querySelectorAll('.ce');
	for (let R=0;R<r;R++){
		let rl = document.createElement('div');
		rl.className = 're';
		rl.style.height = `${rc}px`;
		rl.style.width = `${(wwidth - 8 - rc) / r }px`;
		document.getElementById('row').appendChild(rl);
	}
	document.getElementById('row').style.width = `${wwidth - 24}px`;
	rn = Container.querySelectorAll('.re');
	
	for (let n=0;n<c*r;n++){
		let cell = document.createElement('div');
		cell.className = 'cell';
		cell.style.height = `${(wheight - 6 - rc) / c }px`;
		cell.style.width = `${(wwidth - 8 - rc) / r }px`;
		cell.addEventListener('click', function cellOnClick(event){ cr = false;
			if (mode == 0){
				if (event.ctrlKey) {	//select multiple cell
					cell.setAttribute('selected', 'true');
					s.push(n);
				} else {				//select single cell
					for (let n=0;n<s.length;n++){
						table.querySelectorAll(".cell")[s[n]].removeAttribute('selected');
					} s=[];
					cell.setAttribute('selected', 'true');
					s.push(n);
				}
			}
			
		})
		document.getElementById('table').appendChild(cell);
		if (f>0 && !cell.flip) {	//defining cell.flip for set value of cell.flip[n] without facing null
			cell.flip = [];
			for (let I=0;I<f;I++) {
				cell.flip.push('');
			} cell.f = 0;
		}
		if (txt.length-1 >= i) {
			if (line[i][0] == n) {	//wait to reach at correct line. correct line != '' or not valueless. changing value of valueless cell is waste of memory
				if (line[i][1] == 0) {	cell.innerHTML = txt[i]	}	//instantly load the value if cell is not flip
				if (f>0) {	cell.flip[line[i][1]] = txt[i] }	//Load value of the current cell with "txt" and "line"
				i++;
			}
		}
		cells = Container.querySelectorAll('.cell');
	}
}
getTableData();		//startup Table
window.addEventListener('resize', function WindowOnResize() {
    const wheight = document.documentElement.clientHeight-32;
	const wwidth = document.documentElement.clientWidth-32;
	let Container = document.getElementById('main');	//container of row, col and table
	Container.style.height = `${wheight}px`;
	Container.style.width = `${wwidth}px`;
	let table = document.getElementById('table');
	table.style.height = `${wheight-rc-6}px`;
	table.style.width = `${wwidth-rc-8}px`;
	for (let C=0;C<c;C++){
		cn[C].style.height = `${(wheight - 8 - rc) / c }px`;
		cn[C].style.width = `${rc}px`;
	}
	document.getElementById('column').style.height = `${wheight - 24}px`;
	for (let R=0;R<r;R++){
		rn[R].style.height = `${rc}px`;
		rn[R].style.width = `${(wwidth - 8 - rc) / r }px`;
	}
	document.getElementById('row').style.width = `${wwidth - 24}px`;
	
	for (let n=0;n<c*r;n++){
		cells[n].style.height = `${(wheight - 6 - rc) / c }px`;
		cells[n].style.width = `${(wwidth - 8 - rc) / r }px`;
	}
});

document.addEventListener('keydown', function OnKeydown(event) {
	if (event.key == 'ArrowRight' || event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowDown') {
		let update = [], grantUpdate = true;
		for (let n = 0; n < s.length; n++) {	//transfrom to cell of arrow direction
			if (event.key === 'ArrowLeft') {
				update.push(s[n]-1);
				if (s[n] - 1 < 0) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowRight') {
				update.push(s[n]+1);
				if (s[n] + 1 >= cells.length) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowDown') {
				update.push(s[n]+r);
				if (s[n] + r >= cells.length) {
					grantUpdate = false;
				}
			}
			if (event.key === 'ArrowUp') {
				update.push(s[n]-r);
				if (s[n] - r < 0) {
					grantUpdate = false;
				}
			}
		}
		for (let n = 0; n < update.length; n++) {	//unselect current cell
			if (grantUpdate) {
				cells[s[n]].removeAttribute('selected');
			}
		}
		for (let n = 0; n < update.length; n++) {	//select cell of arrow direction
			if (grantUpdate) {
				s[n] = update[n];
				cells[s[n]].setAttribute('selected', 'true');
			}
		}
	}
	if (event.key == 'e' && s.length > 0){ mode=1;	//edit cell
		for (let n = 0; n < s.length; n++) {
			if (!cells[s[n]].querySelector('input')){
				let input = document.createElement('input');
				cells[s[n]].appendChild(input); input.focus();
				inputs = document.querySelectorAll('input');
			}
		}
	}
	if (event.key == 'Enter'){						//confirm the edit
		if (mode == 1){ mode=0;
			for (let n = 0; n < s.length; n++) {
				cells[s[n]].innerHTML = inputs[n].value;
				cells[s[n]].flip[cells[s[n]].f] = cells[s[n]].innerHTML;
				inputs[n].remove();
			}
		}
	}
	if (event.key == 't' && s.length > 0 && cr == false && mode == 0){ cr = true;	//transfar value cell to cell. BUGGY
		for (let n = 0; n < s.length; n++) {
			cells[s[n]].setAttribute('carry', 'true');
			sc.push(s[n]); scv.push(cells[s[n]].innerHTML);
		}
	}
    if (event.code === 'Numpad5' && f > 0) {		//flip the cell
        for (let n = 0; n < s.length; n++) {
            if (cells[s[n]].f >= cells[s[n]].flip.length-1) {
                cells[s[n]].f = 0;
				cells[s[n]].setAttribute("flipped", 'false');
            } else {
                cells[s[n]].f++;
				cells[s[n]].setAttribute("flipped", 'true');
            };
            cells[s[n]].innerHTML = cells[s[n]].flip[cells[s[n]].f];
        }
    }
	if (event.ctrlKey && event.key == 'x'){let arr = [], pos = [], rown = [], coln = []; console.log('ok')
		for (let p=0;p<cells.length;p++){			//save as file
			for (let t=0;t<f;t++){
				if (cells[p].flip[t] != ''){
					arr.push(cells[p].flip[t]);
					pos.push([p,t]);
				}
			}
		}
		for (let L=0;L<r;L++) {
			rown.push(rn[L].innerHTML)
		}
		for (let L=0;L<c;L++) {
			coln.push(cn[L].innerHTML)
		}
		let data = {
			txt: arr,
			line: pos,
			row: rown,
			col: coln
		}
		console.log("Data to save:", data);
		eel.save_to_json(data);
	}
});
document.addEventListener('keyup', function OnKeyUp(event) {cr = false;
	if (event.key == 't'){
		for (let n = 0; n < s.length; n++) {
			cells[sc[n]].removeAttribute('carry');
			cells[sc[n]].innerHTML = cells[s[n]].innerHTML
			cells[s[n]].innerHTML = scv[n];
		} sc = []; scv = [];
	}
});

