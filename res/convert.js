const aname = ["HP","攻","防","速","敏","魔","抗","智"]

const sname = [
	"火球", "冰冻", "雷击", "地裂", "吸血", "投毒", "连击",
	"会心", "瘟疫", "命轮", "狂暴", "魅惑", "加速", "减速",
	"诅咒", "治愈", "苏生", "净化", "铁壁", "蓄力", "聚气",
	"潜行", "血祭", "分身", "幻术", "防御", "守护", "反弹",
	"护符", "护盾", "反击", "吞噬", "亡灵", "垂死", "隐匿",
	"啧", "啧", "啧", "啧", "啧"]

const sname_eng = [
    "SklFire", "SklIce", "SklThunder", "SklQuake", "SklAbsorb", "SklPoison", "SklRapid",
    "SklCritical", "SklHalf", "SklExchange", "SklBerserk", "SklCharm", "SklHaste", "SklSlow",
    "SklCurse", "SklHeal", "SklRevive", "SklDisperse", "SklIron", "SklCharge", "SklAccumulate",
    "SklAssassinate", "SklSummon", "SklClone", "SklShadow", "SklDefend", "SklProtect", "SklReflect",
    "SklReraise", "SklShield", "SklCounter", "SklMerge", "SklZombie", "SklUpgrade", "SklHide",
    "SkillVoid", "SkillVoid", "SkillVoid", "SkillVoid", "SkillVoid"
]

// ========== 召唤物输出辅助 ==========
function makeSummonLine(name, nametmp, suffix, modifyProps, getSkills, soption) {
    name.load_team(nametmp[1])
    name.load_name(nametmp[0] + suffix)
    var p = name.calc_props()
    modifyProps(p)

    var x = new Array(43)
    x[0] = p[7]
    for (var j = 0; j < 7; j++) {
        p[j] += 36
        x[j + 1] = p[j]
    }

    var skills = getSkills(name)
    for (var i = 0; i < 35; i++) x[i + 8] = 0
    var y = []
    var ptr1 = 0
    for (var i = 0; i < skills.length; i++) {
        var skName = skills[i][0]
        var skLevel = skills[i][1]
        if (skLevel === 0) continue
        var skIdx = sname.indexOf(skName)
        if (skIdx >= 0) x[skIdx + 8] = skLevel
        y[ptr1] = [skLevel, skName]
        ptr1++
    }

    var line = ''
    line += nametmp[0] + suffix + '@' + nametmp[1]
    for (var i = 0; i < 8; i++) line += ' ' + aname[i] + x[i]

    var sum = x[0]/3 + x[1] + x[2] + x[3] + x[4] + x[5] + x[6] + x[7]
    line += ' 八围' + sum.toFixed(1)

    sum = 2*(x[1] + x[5] + x[3] + 0.5*(x[4] + x[7]) - x[2] - x[6])
    line += ' 嘲讽' + sum + ' '

    if (soption > 0) line += '\n'

    sum = 0
    for (var i = 0; i < ptr1; i++) sum += y[i][0]
    line += '技能' + sum

    for (var i = 0; i < ptr1; i++) {
        if (soption == 2) line += '\n'
        line += ' ' + y[i][1] + y[i][0]
    }

    line += '\n'
    if (soption > 0) line += '\n'

    return line
}

function ConvertStart() {
    var tmp1 = document.getElementById("Cinput").value.trim()
    var names = Array.prototype.slice.call(tmp1.split('\n'));

    var soption = document.getElementById("COption").selectedIndex

    var output = document.getElementById("Coutput")
    var dis = document.getElementById("Cdis")
    var showShadow = document.getElementById("chkShadow").checked
    var showSummon = document.getElementById("chkSummon").checked
    var showZombie = document.getElementById("chkZombie").checked
    output.value=''

    var x = new Array(43)
    var y = new Array()
    var name = new Name()
    var s = 0,tmp2=0,tmp3=''
    var length = names.length
    var Loop = setInterval(function(){
        tmp3=''
        for(let ii=0;ii<tmpsize;ii++){
            s=tmp2+ii
            var nametmp = Array.prototype.slice.call(names[s].split('@'));
            if(nametmp.length<2)nametmp[1]=nametmp[0]
            name.load_team(nametmp[1])
            name.load_name(nametmp[0])

            if(nametmp[1]=="!")name.TV()

            //DIY
            var diytmp = Array.prototype.slice.call(names[s].split('+diy'))
            if(diytmp.length>1){
                names[s] = diytmp[0]
                diyname = getDIY(diytmp[1])
                var props = diyname[0]
                name.freq = diyname[1]
                name.skill = diyname[2]
            }else{
                var props = name.calc_props()
                name.calc_skills()
            }

            var rawProps = props.slice()
            for (let j = 0; j < 7; j++)props[j] += 36;
            x = new Array(43)
            y = new Array(35)

            x[0] = props[7]
            for (let i = 0; i < 7; i++) {
                x[i + 1] = props[i]
            }
            for (let i = 0; i < 35; i++) {
                var cf = 0;
                for (let k = 0; k < 16; k++) {
                    if (name.skill[k] == i) {
                        x[i + 8] = name.freq[k]
                        cf = 1;
                    }
                }
                if (cf == 0) {
                    x[i + 8] = 0
                }
            }
            
            

            tmp3 += names[s]
            for (let i = 0; i < 8; i++)tmp3+=' '+aname[i]+x[i]
            var ptr1 = 0
            for (let i = 8; i < 43; i++){
                if(x[i]>0){
                    y[ptr1]=[x[i],sname[i-8]]
                    ptr1++
                }
            }
            var ytmp
            for(let i=0;i<ptr1;i++){
                for(let j=0;j<ptr1-1;j++){
                    if(y[j][0]<y[j+1][0]){
                        ytmp=y[j]
                        y[j]=y[j+1]
                        y[j+1]=ytmp
                    }
                }
            }
            
            var sum = x[0]/3 +x[1]+x[2]+x[3]+x[4]+x[5]+x[6]+x[7]
            tmp3+=' 八围'+sum.toFixed(1)

            sum = 2*(x[1]+x[5]+x[3]+0.5*(x[4]+x[7])-x[2]-x[6])
            tmp3+=' 嘲讽'+sum+" "

            if(soption > 0)tmp3+="\n"

            sum = 0
            for(let i=0;i<ptr1;i++){
                sum += y[i][0]
            }
            tmp3+='技能'+sum



            for(let i=0;i<ptr1;i++){
                if(soption == 2)tmp3+="\n"
                tmp3+=' '+y[i][1]+y[i][0]
            }

            tmp3 += '\n'
            if(soption > 0)tmp3+="\n"

            if (showShadow) tmp3 += makeSummonLine(name, nametmp, '?shadow', function(p) { p[7] = Math.floor(p[7] / 2); }, function(n) {
                var lv = Math.max(0, Math.trunc((Math.min(n.name_base[64], n.name_base[65], n.name_base[66], n.name_base[67]) - 10) / 2) + 36);
                return lv > 0 ? [['附体', lv]] : [];
            }, soption)
            if (showSummon) tmp3 += makeSummonLine(name, nametmp, '?summon', function(p) { p[0] = 0; p[1] = rawProps[1]; p[4] = 0; p[5] = rawProps[5]; p[7] = Math.max(1, Math.floor(p[7] / 3)); }, function(n) {
                var snames = ['火球', '火球', '自爆'];
                var levels = [];
                for (var slot = 0; slot < 3; slot++) {
                    var base = 64 + slot * 4;
                    levels[slot] = Math.max(0, Math.min(n.name_base[base], n.name_base[base+1], n.name_base[base+2], n.name_base[base+3]) - 10);
                }
                // RC4 sort_list 结算顺序
                var order = [0, 1, 2];
                var b = 0;
                for (var round = 0; round < 2; round++) {
                    for (var a = 0; a < 3; a++) {
                        var raw = (n.m() << 8) | n.m();
                        var key_v = raw % 3;
                        var t = order[a];
                        b = (b + t + key_v) % 3;
                        order[a] = order[b];
                        order[b] = t;
                    }
                }
                var sk = [];
                for (var i = 0; i < 3; i++) {
                    sk.push([snames[order[i]], levels[i]]);
                }
                return sk;
            }, soption)
            if (showZombie) tmp3 += makeSummonLine(name, nametmp, '?zombie', function(p) { p[0] = 0; p[6] = 0; p[7] = Math.max(1, Math.floor(p[7] / 2)); }, function() { return []; }, soption)

            names[s]=null
            s++
            if(ii==tmpsize-1 || s==length){
                dis.innerText = (s)+' / '+length
                output.value += tmp3
            }
            if(s==length){
                // window.alert("测试完成");
                dis.innerText = "测试完成，个数："+s
                clearInterval(Loop)
                break
            }
        }
        tmp2+=tmpsize
    },0)
}

function Team_Calc() {
    const input = document.getElementById('TCinput').value.trim().split('\n');
    const n = input.length;
    const team = [];
    const o_skillf = Array.from({ length: n }, () => Array(40).fill(0));
    var dis = document.getElementById("TCdis")
    for (let i = 0; i < n; i++) {
      const member = new Name();
      ss = input[i].split("@");
      member.load_team(ss[1]);
      member.load_name(ss[0]);
      team.push(member);
    }
    // 计算加成
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        team[i].calc_bonus(team[j].name_base);
        team[j].calc_bonus(team[i].name_base);
      }
    }
    var bonus_cnt = [0,0,0];

    // 输出结果
    let output = "";
    for (let i = 0; i < n; i++) {
      output += `${input[i]} `;
      const prop_base = team[i].calc_props();
      const prop_bonus = team[i].calc_props_bonus();
      let wei = prop_bonus[7] / 3.0;
      output += `HP ${prop_bonus[7]}`;
      if (prop_base[7] != prop_bonus[7])
        output += `(+${prop_bonus[7] - prop_base[7]}) `;
        bonus_cnt[0] += (prop_bonus[7] - prop_base[7])/3;
      for (let j = 0; j < 7; j++) {
        output += " " + aname[j + 1] + " ";
        wei += prop_bonus[j] + 36;
        output += `${prop_bonus[j] + 36}`;
        if (prop_base[j] != prop_bonus[j])
          output += `(+${prop_bonus[j] - prop_base[j]})`;
          bonus_cnt[0] += (prop_bonus[j] - prop_base[j]);
        if (j === 6) output += ` 八围 ${wei.toFixed(1)}`;
      }

      var x = new Array()
      x[0] = prop_bonus[7]
      for (let j = 0; j < 7; j++) {x[j+1]=prop_bonus[j]+36}
      wei = 2*(x[1]+x[5]+x[3]+0.5*(x[4]+x[7])-x[2]-x[6])
      output +=' 嘲讽'+wei+"\n"

      output += "skills:\n";
      team[i].calc_skills();
      // team[i].skill.sort((x, y) => y.f - x.f);
      for (let j = 0; j < 40; j++) {
        if (team[i].freqq[j]) {
          sklid = team[i].skill[j];
          if (team[i].freqq[j] != team[i].freq[j]){
            output += `${sname[sklid]} ${team[i].freqq[j]}(+${team[i].freqq[j] - team[i].freq[j]})\n`;
            bonus_cnt[1] += (team[i].freqq[j] - team[i].freq[j]);}
          else{
            output += `${sname[sklid]} ${team[i].freqq[j]}\n`;}
        }
      }
      output += "\n";
      output += `${input[i]}+`;
      output += "diy[";
      for (let j = 0; j < 7;j++) output+=`${prop_bonus[j]+36},`;
      output+=`${prop_bonus[7]}]{`;
      for (let j=0; j<40; j++) {
        if (team[i].freqq[j]) {
          sklid = team[i].skill[j];
          output += `\"${sname_eng[sklid]}\":${team[i].freqq[j]},`;
        }
      }
      output += "\"useless\":0}\n\n\n";
    }
    document.getElementById('TCoutput').value = output;
    dis.innerText = "八围 + " + bonus_cnt[0].toFixed(1) + " 技能 + " + bonus_cnt[1];
}