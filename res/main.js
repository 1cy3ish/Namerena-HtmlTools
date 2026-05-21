function Poly(x) {
    var xp = new Array()
    for (let y = 0; y < 1034; y++) {
        var l = 44
        var i = 0, p = 0, q = 0, r = 0
        var j = y
        for (let k = 0; k < 45; k++) {
            i++;
            if (i > 2) p++;
            q = j;
            j = j - l + p;
            if (j < 0) break;
        }
        if (i == 1) r = x[q]
        if (i > 1) {
            r = x[p] * x[p + q]
        }
        xp[y] = r
    }
    return xp
}

function getDIY(diystr){
    var diyname = new Array(3)

    diyname[0] = JSON.parse(diystr.slice(0,diystr.indexOf(']')+1))
    diyname[1] = new Array(40)
    diyname[2] = new Array(40)

    for (let j = 0; j < 7; j++)diyname[0][j]-=36

    var diySkltmp = JSON.parse(diystr.slice(diystr.indexOf(']')+1,diystr.length))
    var j = 0
    var keys = Object.keys(diySkltmp)
    
    for(let kk=0;kk<keys.length;kk++){
		for(let i=0;i<40;i++){
			if(keys[kk] == sname_eng[i]){
				diyname[1][j] = diySkltmp[sname_eng[i]]
				diyname[2][j] = i
				j++
			}else{
				if(diySkltmp[sname_eng[i]] === undefined){
					diyname[1][39] = 0
				}
			}
		}
    }

    for(let i=0;i<40;i++){
        if(i>=j){
            diyname[1][i]=99
            diyname[2][i]=99
        }
    }

    return diyname

}

var tmpsize = 2500

function ScoreStart() {
    var tmp1 = document.getElementById("SCinput").value.trim()
    var names = Array.prototype.slice.call(tmp1.split('\n'));

    var output = document.getElementById("SCoutput")
    var dis = document.getElementById("SCdis")
    output.value=''

    var lim = new Array(4)
    var items = new Array(4)
    items[0] = document.getElementById("lim1")
    items[1] = document.getElementById("lim2")
    items[2] = document.getElementById("lim3")
    items[3] = document.getElementById("lim4")
    items[4] = document.getElementById("lim5")
    var soption = document.getElementById("SCoption").selectedIndex

    for(let i=0; i<items.length; i++) {
        lim[i] = parseInt(items[i].value.trim())
        if(isNaN(lim[i]))lim[i] = -99999999
    }

    var x = new Array(43)
    var name = new Name()
    var s = 0,tmp2=0,tmp3=''
    var length = names.length
    var Loop = setInterval(function(){
        //tmp3=''
        for(let ii=0;ii<tmpsize;ii++){
            s=tmp2+ii
            var nametmp = Array.prototype.slice.call(names[s].split('@'));
            if(nametmp.length<2)nametmp[1]=nametmp[0]
            name.load_team(nametmp[1])
            name.load_name(nametmp[0])
            if(nametmp[1]=="!")name.TV()

            //DIY / OL
            var diytmp = Array.prototype.slice.call(names[s].split('+diy'))
            var oltmp = Array.prototype.slice.call(names[s].split('+ol:'))
            if(diytmp.length>1){
                names[s] = diytmp[0]
                nametmp = Array.prototype.slice.call(names[s].split('@'));
                if(nametmp.length<2)nametmp[1]=nametmp[0]
                name.load_team(nametmp[1])
                name.load_name(nametmp[0])

                diyname = getDIY(diytmp[1])
                var props = diyname[0]
                name.freq = diyname[1]
                name.skill = diyname[2]
            }else if(oltmp.length>1){
                names[s] = oltmp[0]
                nametmp = Array.prototype.slice.call(names[s].split('@'));
                if(nametmp.length<2)nametmp[1]=nametmp[0]
                name.load_team(nametmp[1])
                name.load_name(nametmp[0])

                diyname = getOL(oltmp[1])
                var props = diyname[0]
                name.freq = diyname[1]
                name.skill = diyname[2]
            }else{
                var props = name.calc_props()
                name.calc_skills()
            }

            for (let j = 0; j < 7; j++)props[j] += 36;
            x = new Array(44)

            x[0] = props[7]
            for (let i = 0; i < 7; i++) {
                x[i + 1] = props[i]
            }
            if(soption == 0){
                for (let i = 0; i < 35; i++) {
                    x[i + 8] = 0
                    for (let k = 0; k < 16; k++) {
                        if (name.skill[k] == i) {
                            x[i + 8] = name.freq[k]
                            cf = 1;
                        }
                    }
                }              
                
                if (x[32]>0){
                    name.load_name(nametmp[0]+'?shadow')
                    props = name.calc_props()
                    var shadow_sum = props[7]/3
                    for (let j = 0; j < 7; j++)shadow_sum += props[j]
    
                    //更新部分
                    shadow_sum -= props[6]*3
                    shadow_sum -= 210
    
                    //更新部分
                    shadow_sum = shadow_sum * x[32] / 100
                    x[43]=shadow_sum.toFixed(3)
                }else{
                    x[43]=0
                }
                if (x[42]>0)x[42]+=20
            }else if(soption == 3){
                for (let i = 0; i < 38; i++) {
                    x[i+8]=0
                }  
                var zd=1,kill=1,bd=1;
                for (let k=0;k<16;k++)
                    {
                        if (name.skill[k]==9 || name.skill[k]==16) //命轮苏生
                        {
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.3/128);
                        }
                        else if (name.skill[k]==18) //铁壁
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.35/128);
                        }
                        else if (name.skill[k]==19 || name.skill[k]==23) //蓄力
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.6/128);
                        }
                        else if (name.skill[k]==20 || name.skill[k]==22) //聚气血祭
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.7/128);
                        }
                        else if (name.skill[k]<25) //一般主动
                        {
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*1.0/128);
                        } 
                        else if (name.skill[k]==31 || name.skill[k]==32)
                        {
                            x[name.skill[k]+8] = kill*name.freq[k];
                            kill*=(1-name.freq[k]*1.0/128);
                        } 
                        else {x[name.skill[k]+8]=name.freq[k]}
                    }
                    if (x[37] <= 70){ x[37] = x[37] * x[37] / 70;}
                    else{x[37] = x[37] * 2 - 70;}
                    if (x[32] > 0) {
                        name.load_name(nametmp[0]+'?shadow')
                        var prop = name.calc_props()
                        var shadowi = prop[0]*2.8+prop[1]*0.6+prop[2]*2.5+prop[3]*1.2+prop[4]+prop[5]-1.2*prop[6]+0.8*prop[7];
                        x[43] = shadowi * 1.0 * x[32] / 100;
                    }
                    else {x[43] = 0;}
                    if (x[42] > 0) x[44] = 1;
                    if (x[37] > 0){x[45] = x[26];x[26]=0;}
            
            }else if(soption == 4){
                for (let i = 0; i < 38; i++) {
                    x[i+8]=0
                }  
                var zd=1,kill=1,bd=1;
                var skill_para = [1,1,1,0.5,0.75,0.75,1,1,0.75,0.5,1,1,1,0.75,1,0.75,0.2,1,0.75,0.5,0.3,0.75,0.75,0.3,0.75];
                for (let k=0;k<16;k++)
                    {
                        if (name.skill[k]<25)
                        {
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*skill_para[name.skill[k]]/128);
                        }
                        else if (name.skill[k]==31 || name.skill[k]==32)
                        {
                            if(name.freq[k]>64)name.freq[k] = 64;
                            x[name.skill[k]+8] = kill*name.freq[k];
                            kill*=(1-name.freq[k]*0.8/128);
                        } 
                        else {x[name.skill[k]+8]=name.freq[k]}
                    }
                    if (x[37] <= 60){ x[37] = x[37] * x[37] / 60;}
                    else{x[37] = x[37] * 2 - 60;}
                    if (x[32] > 0) {
                        name.load_name(nametmp[0]+'?shadow')
                        var prop = name.calc_props()
                        var shadowi = prop[0]*2.2+prop[1]*0.75+prop[2]*1.9+prop[3]*1.3+prop[4]*0.6+prop[5]*1.2-prop[6]*1.8+prop[7];
                        x[43] = shadowi * 1.0 * x[32] / 100;
                    }
                    else {x[43] = 0;}
                    if (x[42] > 0) x[44] = 1;
                    if (x[37] > 0){x[45] = x[26];x[26]=0;}
            }
            else{
                for (let i = 0; i < 35; i++) {
                    x[i+8]=0
                }  
                var zd=1,kill=1,bd=1;
                for (let k=0;k<16;k++)
                    {
                        if (name.skill[k]==9 || name.skill[k]==16) //命轮苏生
                        {
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.3/128);
                        }
                        else if (name.skill[k]==18) //铁壁
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.35/128);
                        }
                        else if (name.skill[k]==19) //蓄力
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.6/128);
                        }
                        else if (name.skill[k]==20 || name.skill[k]==22) //聚气血祭
                        {
                            
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*0.7/128);
                        }
                        else if (name.skill[k]<25) //一般主动
                        {
                            x[name.skill[k]+8]=zd*name.freq[k];
                            zd*=(1-name.freq[k]*1.0/128);
                        } 
                        else if (name.skill[k]==31 || name.skill[k]==32)
                        {
                            x[name.skill[k]+8] = kill*name.freq[k];
                            kill*=(1-name.freq[k]*1.0/128);
                        } 
                        else if (name.skill[k]==99) //神秘占位玩意
                        {
                            //憋憋
                        } 
                        else {x[name.skill[k]+8]=name.freq[k]}
                    }


                if (x[32]>0){
                    name.load_name(nametmp[0]+'?shadow')
                    props = name.calc_props()
                    var shadow_sum = props[0]*2.8+props[1]*0.6+props[2]*2.5+props[3]*1.2+props[4]+props[5]-1.2*props[6]+0.8*props[7];

                    shadow_sum = shadow_sum * x[32] / 100
                    x[43]=shadow_sum.toFixed(3)
                }else{
                    x[43]=0
                }
                if (x[42]>0)x[42]+=20
            }
            
            //console.log(x)

            if(soption == 0){
                var xp = Poly(x)
                var score = model[0]
                var scoreQD = modelQD[0]
                for (let i = 0; i < 1034; i++) {
                    score += xp[i] * model[i + 1]
                }
                for (let i = 0; i < 1034; i++) {
                    scoreQD += xp[i] * modelQD[i + 1]
                }
    
                if(score>=lim[0] && scoreQD>=lim[1]){
                    tmp3 += names[s] + ' ' + parseInt(score) + ' ' + parseInt(scoreQD)
                    if(x[32]>32)tmp3+=' !幻术'
                    // if(x[26]>32)tmp3+=' !铁壁'
                    // if(x[11]>32)tmp3+=' !地裂'
                    // if(x[29]>32)tmp3+=' !背刺'
                    tmp3 += '\n'
                }    
            }else if (soption == 1){
                var sp = Poly(x)
                var SP_Score = new Array(4)
                SP_Score[0] = model_SP_CP[0]
                SP_Score[1] = model_SP_FP[0]
                SP_Score[2] = model_SP_WC[0]
                SP_Score[3] = model_SP_DT[0]

                if(x[29]>30){//背刺
                    for (let i = 0; i < 1034; i++) {
                        SP_Score[0] += sp[i] * model_SP_CP[i + 1]
                    }
                    if(SP_Score[0]>=lim[0])tmp3 += names[s] + ' SCP: ' + parseInt(SP_Score[0]+0.5) + '\n'
                }else{
                    for (let i = 0; i < 1034; i++) {
                        SP_Score[1] += sp[i] * model_SP_FP[i + 1]
                    }
                    if(SP_Score[1]>=lim[1])tmp3 += names[s] + ' SFP: ' + parseInt(SP_Score[1]+0.5) + '\n'
                    for (let i = 0; i < 1034; i++) {
                        SP_Score[2] += sp[i] * model_SP_WC[i + 1]
                    }
                    if(SP_Score[2]>=lim[2])tmp3 += names[s] + ' SWC: ' + parseInt(SP_Score[2]+0.5) + '\n'
                }
                for (let i = 0; i < 1034; i++) {
                    SP_Score[3] += sp[i] * model_SP_DT[i + 1]
                }
                if(SP_Score[3]>=lim[3])tmp3 += names[s] + ' SDT: ' + parseInt(SP_Score[3]+0.5) + '\n'
            }else if (soption == 2){
                var sp = Poly(x)
                var SP_Score = new Array(4)
                SP_Score[0] = model_SP_FS[0]
                SP_Score[1] = model_SP_FSPJ[0]
                SP_Score[2] = model_SP_HS[0]
                SP_Score[3] = model_SP_HSPJ[0]

                // for (let i = 0; i < 1034; i++) {
                //     SP_Score[0] += sp[i] * model_SP_FS[i + 1]
                // }
                // if(SP_Score[0]>=lim[0])tmp3 += names[s] + ' SFS挂了: ' + parseInt(SP_Score[0]+0.5) + '\n'

                for (let i = 0; i < 1034; i++) {
                    SP_Score[1] += sp[i] * model_SP_FSPJ[i + 1]
                }
                if(SP_Score[1]>=lim[1])tmp3 += names[s] + ' SFSPJ: ' + parseInt(SP_Score[1]+0.5) + '\n'

                // for (let i = 0; i < 1034; i++) {
                //     SP_Score[2] += sp[i] * model_SP_HS[i + 1]
                // }
                // if(SP_Score[2]>=lim[2])tmp3 += names[s] + ' SHS挂了: ' + parseInt(SP_Score[2]+0.5) + '\n'

                for (let i = 0; i < 1034; i++) {
                    SP_Score[3] += sp[i] * model_SP_HSPJ[i + 1]
                }
                if(SP_Score[3]>=lim[3])tmp3 += names[s] + ' SHSPJ: ' + parseInt(SP_Score[3]+0.5) + '\n'

            }
            else if (soption == 3){
                var score1,score2
                var xp_x = new Array(4)
                var xp_array = new Array(4)
                for (let i=0;i<=45;i++) xp_x[i]=x[i];
                var cnt=1;
                for (let i=0;i<46;i++) xp_array[++cnt]=xp_x[i];
                for (let i=0;i<46;i++) for (let j=i;j<46;j++) if ((!(i==26 && j==37)) && (!(i==26 && j==45)) && (!(i==42 && j==44)) && (!(i==44 && j==44)) ){
                    xp_array[++cnt]=xp_x[i]*xp_x[j];
                }
		        xp_array[1]=1;

                //qp
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_qp0[i]*xp_array[i+1];
                if(score2>=lim[0])tmp3 += names[s] + ' SQP: ' + parseInt(score2+0.5) + '\n'

                //qd
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_qd0[i]*xp_array[i+1];
                if(score2>=lim[1])tmp3 += names[s] + ' SQD: ' + parseInt(score2+0.5) + '\n'

                //pp
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_pp0[i]*xp_array[i+1];
                if(score2>=lim[2])tmp3 += names[s] + ' SPP: ' + parseInt(score2+0.5) + '\n'

                //cqd
                score1 = 0
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_cqd0[i]*xp_array[i+1];
                if (x[32]>=30){
                    for (let i=0;i<1124;i++){score1+=model_cqd3[i]*xp_array[i+1]; }
                }
                score2 = max(score1,score2)*100;
                if(score2>=lim[3])tmp3 += names[s] + ' SCQD: ' + parseInt(score2+0.5) + '\n'
            }
            else if (soption == 4){
                var score2
                var xp_x = new Array(4)
                var xp_array = new Array(4)
                for (let i=0;i<=45;i++) xp_x[i]=x[i];
                var cnt=1;
                for (let i=0;i<46;i++) xp_array[++cnt]=xp_x[i];
                for (let i=0;i<46;i++) for (let j=i;j<46;j++) if ((!(i==26 && j==37)) && (!(i==26 && j==45)) && (!(i==42 && j==44)) && (!(i==44 && j==44)) ){
                    xp_array[++cnt]=xp_x[i]*xp_x[j];
                }
		        xp_array[1]=1;

                //cp
                if(x[29]>24){//背刺
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_cp0[i]*xp_array[i+1];
                if(score2>=lim[0])tmp3 += names[s] + ' SCP: ' + parseInt(score2+0.5) + '\n'}

                //fp
                if(x[29]<36){
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_fp0[i]*xp_array[i+1];
                if(score2>=lim[1])tmp3 += names[s] + ' SFZ: ' + parseInt(score2+0.5) + '\n'

                //wc
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_wc0[i]*xp_array[i+1];
                if(score2>=lim[2])tmp3 += names[s] + ' SWC: ' + parseInt(score2+0.5) + '\n'}

                //fs
                if(x[31]*2+x[32]+0.01*x[31]*x[19]+0.01*x[31]*x[36]>=50){
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_fs0[i]*xp_array[i+1];
                if(score2>=lim[3])tmp3 += names[s] + ' SFS: ' + parseInt(score2+0.5) + '\n'}

                //pj
                score2 = 0
                for (let i=0;i<1124;i++) score2+=model_pj0[i]*xp_array[i+1];
                if(score2>=lim[4])tmp3 += names[s] + ' SPJ: ' + parseInt(score2+0.5) + '\n'

            }

            names[s]=null
            s++
            if(ii==tmpsize-1 || s==length){
                dis.innerText = (s)+' / '+length
                //output.value += tmp3
            }
            if(s==length){
                dis.innerText = "测试完成，个数："+s
                output.value += tmp3
                clearInterval(Loop)
                break
            }
        }
        tmp2+=tmpsize
    },0)
}
function LoadVersion(){
    var dis = document.getElementById("dis")
    dis.innerText = "模型版本： "+version
}

function RemoveScores(){
    var tmp1 = document.getElementById("RSinput").value.trim()
    var names = Array.prototype.slice.call(tmp1.split('\n'));
    var soption = document.getElementById("RSOption").selectedIndex
    var clen = document.getElementById("clen").value.trim()
    if(isNaN(clen))clen = 0

    var output = document.getElementById("RSoutput")
    var dis = document.getElementById("RSdis")
    output.value=''
    var count = 0

    var s = 0,tmp2=0,tmp3=''
    var length = names.length
    var Loop = setInterval(function(){
        // tmp3=''
        for(let ii=0;ii<tmpsize;ii++){
            s=tmp2+ii

            if(soption == 0){
                tmp3 += names[s].slice(5,names[s].length)+'\n'
            }else if(soption == 1){
                tmp3 += names[s].slice(0,names[s].length-5)+'\n'
            }else if(soption == 2){
                tmp3 += names[s].slice(10,names[s].length)+'\n'
            }else if(soption == 3){
                tmp3 += names[s].slice(0,names[s].length-10)+'\n'
            }else if(soption == 4){
                tmp3 += names[s].slice(clen,names[s].length)+'\n'
            }else if(soption == 5){
                tmp3 += names[s].slice(0,names[s].length-clen)+'\n'
            }
            
            count++

            names[s]=null
            s++
            if(ii==tmpsize-1 || s==length){
                dis.innerText = (s)+' / '+length
                // output.value += tmp3
            }
            if(s==length){
                dis.innerText = "处理完成，个数："+count
                output.value += tmp3
                clearInterval(Loop)
                break
            }
        }
        tmp2+=tmpsize
    },0)
}

function RSClear(){
	var tmp1 = document.getElementById("RSinput")
	var output = document.getElementById("RSoutput")
	tmp1.value = ''
	output.value = ''
}

function GenTeams(){
    var tmpA = document.getElementById("inputA").value.trim()
    var tmpB = document.getElementById("inputB").value.trim()
    var namesA = Array.prototype.slice.call(tmpA.split('\n'));
    var namesB = Array.prototype.slice.call(tmpB.split('\n'));

    var output = document.getElementById("Toutput")
    var dis = document.getElementById("Tdis")
    output.value=''

    var s = 0,tmp2=0,tmp3=''
    var length = namesA.length*namesB.length
    var Loop = setInterval(function(){
        tmp3=''
        for(let ii=0;ii<tmpsize;ii++){
            s=tmp2+ii

            tmp3 += namesA[Math.floor(s/namesB.length)]+"+"+namesB[s%namesB.length]+'\n'

            s++
            if(ii==tmpsize-1 || s==length){
                dis.innerText = (s)+' / '+length
                output.value += tmp3
            }
            if(s==length){
                dis.innerText = "处理完成，组数："+s
                clearInterval(Loop)
                break
            }
        }
        tmp2+=tmpsize
    },0)
}