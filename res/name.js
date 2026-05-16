const N = 256, M = 128, K = 64, skill_cnt = 40

function Name() {
    this.val_base = new Array(N)
    this.val = new Array(N)
    this.name_base = new Array(M)
    this.freq = new Array(skill_cnt)
    this.freqq = new Array(skill_cnt)
    this.skill = new Array(skill_cnt)
    this.p = 0
    this.q = 0
    this.q_len = 0
    this.name_bonus = new Array(M)
    this.name = ""
    this.team = ""

    this.m = function () {
        this.q += this.val[++this.p]
        if(this.q>255)this.q=this.q%256
        var tmp = this.val[this.q]
        this.val[this.q] = this.val[this.p]
        this.val[this.p] = tmp
        return this.val[(this.val[this.p] + this.val[this.q]) & 255];
    }
    this.gen = function () {
        var u = this.m()
        return (u << 8 | this.m()) % skill_cnt;
    }
    this.TV = function () {
        var s;
		var t;
		for(t=6;t<50;++t){
			s=this.name_base[t];
			if(s<41)this.name_base[t]=(s&15)+41
		}
		for(t=50;t<128;++t){
			s=this.name_base[t];
			if(s<16)this.name_base[t]=s+32
		}
    }
    this.load_team = function (steam) {
        this.team = steam
        var team = getUTF8Bytes(steam)
        var t_len = team.length + 1
        var s = 0
        for (var x in team) team[x] -= 256

        for (let i = 0; i < N; i++) { this.val_base[i] = i }
        for (let i = 0; i < N; ++i) {
            if (i % t_len != 0) {
                s += team[i % t_len - 1]
                if (s < 0) s += 256
            }
            s += this.val_base[i]
            s = s % 256
            var tmp = this.val_base[s]
            this.val_base[s] = this.val_base[i]
            this.val_base[i] = tmp
        }
    }
    this.load_name = function (sname) {
        this.name = sname
        var name = getUTF8Bytes(sname)
        var n_len = name.length + 1
        this.q_len = 0
        this.val = JSON.parse(JSON.stringify(this.val_base))
        var s = 0;

        for (let a = 0; a < 2; a++) {
            s = 0
            for (let i = 0; i < N; i++) {
                if (i % n_len != 0) s += name[i % n_len - 1];
                s += this.val[i];
                s = s % 256
                var tmp = this.val[s]
                this.val[s] = this.val[i]
                this.val[i] = tmp
            }
        }
        for (let i = 0; i < N; i++) {
            var m = this.val[i] * 181 + 160;
            m = m % 256
            if (m >= 89 && m < 217) {
                this.name_base[this.q_len] = m & 63;
                this.q_len++
            }
        }
        this.name_bonus = JSON.parse(JSON.stringify(this.name_base));
    }

    this.calc_props = function () {
        var r = JSON.parse(JSON.stringify(this.name_base))
        var a = JSON.parse(JSON.stringify(this.name_base))
        var props = new Array(8)
        r.length = 10
        var p_cnt = 0

        for (this.p = 10, this.q = 31; this.p < this.q; this.p += 3) {
            props[p_cnt++] = max(min(a[this.p], a[this.p + 1]),
                min(max(a[this.p], a[this.p + 1]), a[this.p + 2]))
        }
        r.sort(function (ax, bx) { return ax - bx });
        props[p_cnt++] = 154
        for (let i = 3; i < 7; i++) props[p_cnt - 1] += r[i];
        return props
    }

    this.calc_props_bonus = function () {
        var r = JSON.parse(JSON.stringify(this.name_bonus))
        var a = JSON.parse(JSON.stringify(this.name_bonus))
        var props = new Array(8)
        r.length = 10
        var p_cnt = 0

        for (this.p = 10, this.q = 31; this.p < this.q; this.p += 3) {
          props[p_cnt++] = max(min(a[this.p], a[this.p + 1]),
            min(max(a[this.p], a[this.p + 1]), a[this.p + 2]))
        }
        r.sort(function (ax, bx) { return ax - bx })
        props[p_cnt++] = 154
        for (let i = 3; i < 7; i++) props[p_cnt - 1] += r[i]
        return props
    }

    this.calc_skills = function () {
        var a = new Array(K)
        var aa = new Array(K)
        for (let x = 0; x < K; x++) a[x] = this.name_base[x + K]
        for (let x = 0; x < K; x++) aa[x] = this.name_bonus[x + K]
        for (let i = 0; i < skill_cnt; i++) this.skill[i] = i
        for (let x = 0; x < skill_cnt; x++) this.freq[x] = 0
        this.p = 0
        this.q = 0
        var s = 0
        for (let zz = 0; zz < 2; zz++) {
          for (let i = 0; i < skill_cnt; i++) {
            s = (s + this.gen() + this.skill[i]) % skill_cnt
            var tmp = this.skill[s]
            this.skill[s] = this.skill[i]
            this.skill[i] = tmp
          }
        }
        var last = -1
        for (let i = 0, j = 0; i < K; i += 4, j++) {
          var p = Math.min(a[i], a[i + 1], a[i + 2], a[i + 3])
          var pp = Math.min(aa[i], aa[i + 1], aa[i + 2], aa[i + 3])
          if (p > 10 && this.skill[j] < 35) {
            this.freq[j] = p - 10
            if (this.skill[j] < 25) last = j
          }
          if (pp > 10 && this.skill[j] < 35) {
            this.freqq[j] = pp - 10
          }
        }
        if (last != -1) this.freq[last] <<= 1
        if (last != -1) this.freqq[last] <<= 1
        if (this.freq[14] && last != 14)
          this.freq[14] += Math.min(this.name_base[60], this.name_base[61], this.freq[14])
        if (this.freqq[14] && last != 14)
          this.freqq[14] += Math.min(this.name_bonus[60], this.name_bonus[61], this.freqq[14])
        if (this.freq[15] && last != 15)
          this.freq[15] += Math.min(this.name_base[62], this.name_base[63], this.freq[15])
        if (this.freqq[15] && last != 15)
          this.freqq[15] += Math.min(this.name_bonus[62], this.name_bonus[63], this.freqq[15])
    }

    this.calc_bonus = function (a) {
        for (let i = 7; i < M; i++) {
          if (a[i - 1] === this.name_base[i]) {
            this.name_bonus[i] = Math.max(this.name_bonus[i], a[i]);
          }
        }
        if (this.name === this.team) {
          for (let i = 5; i < M; i++) {
            if (a[i - 2] === this.name_base[i]) {
              this.name_bonus[i] = Math.max(this.name_bonus[i], a[i]);
            }
          }
        }
    }
}

function max(a, b) {
    if (a > b) return a
    else return b
}
function min(a, b) {
    if (a > b) return b
    else return a
}

const encoder = new TextEncoder();

function getUTF8Bytes(str) {return [...encoder.encode(str)]}