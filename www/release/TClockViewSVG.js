class ViewSVG {
    constructor(root) {
        this.root = root;
        this.wrapper = null;                       
        this.start = null;
        this.stop = null;
        this.checkedChangeHandler = null;
        this.watchFace = null;
        this.wrapperSVG = null;
        this.coord = null; 
        this.digit = [];
        this.text = [];
        this.cx = [];
        this.cy = [];
        this.clock = null;
        this.clockhands=[];
        this.degreeHour = null;
        this.degreeMin = null;
        this.degreeSec = null;
        this.zone = null;
        this.hour = null;
        this.mimutes = null;
        this.seconds = null;

    }

    render(model) {
        // представление создает dom элементы в первый раз        
        if (!this.wrapper) {
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'wrapper';                                                
            this.start = document.createElement('input');
            this.start.type = 'button';
            this.start.value = 'старт';
            this.stop = document.createElement('input');
            this.stop.type = 'button';
            this.stop.value = 'стоп';
            this.zone = document.createElement('span');            
            this.start.addEventListener('click', e => this.checkedChangeHandler(e.target.value));
            this.stop.addEventListener('click', e => this.checkedChangeHandler(e.target.value));                 
            this.wrapper.appendChild(this.stop);
            this.wrapper.appendChild(this.start);
            this.wrapper.appendChild(this.zone);           
            this.root.appendChild(this.wrapper);
            this.svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
            this.svg.setAttribute('width', 300);
            this.svg.setAttribute('height', 300);
            this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');         
            this.watchFace = document.createElementNS("http://www.w3.org/2000/svg",'circle');
            this.watchFace.setAttribute('cx', 150);
            this.watchFace.setAttribute('cy', 150);
            this.watchFace.setAttribute('r', 150);            
            this.watchFace.setAttribute('fill', '#fcca66');
            this.wrapperSVG = document.createElement('div');
            this.wrapperSVG.appendChild(this.svg);
            this.wrapper.appendChild(this.wrapperSVG);          
            this.svg.appendChild(this.watchFace);
            this.coord = this.watchFace.getBoundingClientRect();
            
            for (let i = 12; i >= 1; i--) {
                this.digit[i] = document.createElementNS("http://www.w3.org/2000/svg",'circle'),
                this.text[i] = document.createElementNS("http://www.w3.org/2000/svg",'text'),
                this.cx[i] = this.coord.width/2 + (this.coord.width/2 - 30) * Math.sin(Math.PI * i / 6),
                this.cy[i] = this.coord.width/2 - (this.coord.width/2 - 30) * Math.cos(Math.PI * i / 6);
                this.digit[i].setAttribute('cx', this.cx[i]);
                this.digit[i].setAttribute('cy', this.cy[i]);
                this.digit[i].setAttribute('r', 20);            
                this.digit[i].setAttribute('fill', '#48b382'); 
                this.text[i].textContent = i;
                this.text[i].setAttribute('x', this.cx[i]);
                this.text[i].setAttribute('y', this.cy[i] + 5);
                this.text[i].setAttribute('text-anchor', 'middle');
                this.svg.appendChild(this.digit[i]);
                this.svg.appendChild(this.text[i]);
            }                
            
            this.clock = document.createElementNS("http://www.w3.org/2000/svg",'text');                            
            this.clock.setAttribute('text-anchor', 'middle');
            this.clock.setAttribute('x', this.coord.width/2);
            this.clock.setAttribute('y', this.coord.height/2 - 40);                
            this.clock.setAttribute('font-size', 35);
            this.clock.textContent = '00:00:00';  
            this.svg.appendChild(this.clock);
            
            for (let i = 1; i <= 3; i++) {
                this.clockhands[i] = document.createElementNS("http://www.w3.org/2000/svg",'line');
                this.clockhands[i].setAttribute('x1', this.coord.width/2);
                this.clockhands[i].setAttribute('y1', this.coord.width/2);
                this.clockhands[i].setAttribute('x2', this.coord.width/2);
                this.clockhands[i].setAttribute('y2', this.coord.width/2 - 20 * i - 50);
                this.clockhands[i].setAttribute('stroke', 'black');
                this.clockhands[i].setAttribute('stroke-width', 8 - 2 * i);
                this.clockhands[i].setAttribute('stroke-linecap', 'round');
                this.clockhands[i].setAttribute('stroke-opacity', 0.7);                
                this.svg.appendChild(this.clockhands[i]);
            }
        }
        this.zone.textContent = ` GMT ${model.timezone}`;
        this.hour = model.hours;
        if (this.hour < 10) this.hour = '0' + model.hours;
        this.mimutes = model.mimutes;
        if (this.mimutes < 10) this.mimutes = '0' + model.mimutes;
        this.seconds = model.seconds;
        if (this.seconds < 10) this.seconds = '0' + model.seconds;
        this.clock.textContent = `${this.hour}:${this.mimutes}:${this.seconds}`;
        this.degreeHour = 30*(model.hours + (1/60)*model.mimutes);
        this.degreeMin = 6*(model.mimutes + (1/60)*model.seconds);
        this.degreeSec = 6*model.seconds;
        this.clockhands[1].setAttribute('transform', `rotate(${this.degreeHour} ${this.coord.width/2} ${this.coord.height/2})`);
        this.clockhands[2].setAttribute('transform', `rotate(${this.degreeMin} ${this.coord.width/2} ${this.coord.height/2})`);
        this.clockhands[3].setAttribute('transform', `rotate(${this.degreeSec} ${this.coord.width/2} ${this.coord.height/2})`);
    }

    setChangeHandler(handler) {
        this.checkedChangeHandler = handler;
    }      
}