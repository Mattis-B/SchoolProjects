import React from 'react'
import styles from './JSRand.module.sass'
import Head from 'next/head'

var normalSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var specialSymbols = "0123456789$:;,";

class JSRand extends React.Component {
  render(){
    var lenOptions = [];
    for(let i = 2; i <= 32; i+=2) lenOptions.push(i);
    return(
      <>
      <Head>
        <title>JSRand</title>
      </Head>
      <form className={styles.passForm} action="none">
      	 <table>
      			 <tr><td>
      				 <label><acronym title="For use in a once off transfer when the password does not need to be spoken i.e. fax.">Normal: </acronym></label>
      			 </td><td>
      				 <input type="radio" name="option" value="normal"/>
      			 </td><td rowspan="8" align="right">
      				 <label>One Time Password List:</label>&nbsp;&nbsp;
      				 <input type="button" value="Print OTP List" onClick={this.printOTP.bind(this)} /><br />
      				 <textarea name="listOTP" style={{width:"3in"}} rows="20" readonly="readonly"></textarea><br />
      			 </td></tr><tr><td>
      				 <label><acronym title="For use in a once off transfer when the password will be given via phone.">Will be spoken: </acronym></label>
      			 </td><td>
      				 <input type="radio" name="option" value="noSpecial" checked="checked" />
      			 </td></tr>
      			 <tr><td colspan="2"><hr /></td></tr>
      			 <tr><td><label><acronym title="Set the length of Single Password.">Length: </acronym></label>
      			 </td><td>
      				 <select name="selLength">
      					{lenOptions.map(o=><option value={o}>{o}</option>)}
      				 </select>
      			 </td></tr><tr><td>
      				 <label><acronym title="For use when data will regularly be shared with a third party.">One Time Passwords: </acronym></label>
      			 </td><td>
      				 <input type="checkbox" name="chkOTP" value="true" />
      			 </td></tr><tr><td colspan="2">
      				 <input style={{width:"3in"}} type="button" value="Generate Password" onClick={this.doWork.bind(this)} /><br />
      			 </td></tr><tr><td colspan="2">
      				 <br /><br /><br /><br /><br />
      				 <label>Single Password: </label><br />
      				 <input class="constwidth" type="text" name="passField" value="" style={{width:"3in"}} readonly="readonly" />
      			 </td></tr><tr><td colspan="2">
      				 <label>Pronunciation: </label><br />
      				 <textarea name="passPhonetic" style={{width:"3in"}} rows="3" readonly="readonly"></textarea>
      			 </td></tr>
      	 </table>
      </form>
      </>
    )
  }

  doWork()
  {

  		//Check for compatible browser version
      if (parseInt(navigator.appVersion) <= 3) {
          alert("Sorry this only works in 4.0 browsers");
          return true;
      }

  		document.getElementsByClassName(styles.passForm)[0].listOTP.value = "";
  		document.getElementsByClassName(styles.passForm)[0].passPhonetic.value = "";

  		//Check for one time password
  		if (document.getElementsByClassName(styles.passForm)[0].chkOTP.checked) {
           document.getElementsByClassName(styles.passForm)[0].passField.value = "";
           var i = 0;
           for (i=1; i<21; i++) {
               document.getElementsByClassName(styles.passForm)[0].listOTP.value += i+"\t: "+this.GeneratePassword()+"\n";
           }
           document.getElementsByClassName(styles.passForm)[0].listOTP.focus();
           document.getElementsByClassName(styles.passForm)[0].listOTP.select();
  		}
  		//generate normal password (not one time password)
  		else {
  			var Password = this.GeneratePassword();
           document.getElementsByClassName(styles.passForm)[0].passField.value = Password

  			//check for will be spoken
  			if (document.getElementsByClassName(styles.passForm)[0].option[1].checked) {
  				document.getElementsByClassName(styles.passForm)[0].passPhonetic.value = this.makePhonetic();
  			}

           document.getElementsByClassName(styles.passForm)[0].passField.focus();
           document.getElementsByClassName(styles.passForm)[0].passField.select();
  		}

      return true;
  }

  GeneratePassword()
  {
  	//Set variables
      var length= (document.getElementsByClassName(styles.passForm)[0].selLength.value);
      var sPassword = "";
  	var noSpecial = (document.getElementsByClassName(styles.passForm)[0].option[1].checked);

    //Generate password
    for (let i=+[]; i < length; ++i) {
        var numI = this.getRandomNum();
  			if (noSpecial) {
  				while (this.checkSpecial(numI)) {
  					numI = this.getRandomNum();
  				}
  			}
        sPassword = sPassword + String.fromCharCode(numI);
      }

  		return sPassword;
  }

  getRandomNum()
  {

      // between 0 - 1
      var rndNum = Math.random();

      // rndNum from 0 - 1000
      rndNum = parseInt(rndNum * 1000);

      // rndNum from 33 - 127
      rndNum = (rndNum % 94) + 33;

      return rndNum;
  }

  checkSpecial(num) {
    return ((num >=33) && (num <=47)) || ((num >=58) && (num <=64)) || ((num >=91) && (num <=96)) || ((num >=123) && (num <=126));
  }

  makePhonetic()
  {
  	var text=document.getElementsByClassName(styles.passForm)[0].passField.value;

  	let phonArray={};

    for (let i = +[]; i < normalSymbols.length; ++i) {
      phonArray[normalSymbols[i]] = normalSymbols[i] + this.makeid(Math.floor(Math.random()*3+2));
    }

    for(let i = +[]; i < specialSymbols.length; ++i){
      phonArray[specialSymbols[i]] = this.makeid(Math.floor(Math.random()*3+3))
    }


  	var trans="";

  	var regExp=/[\!@#$%^&*(),=";:\/]/;
  	var stringCheck=regExp.exec(text);

  	if(!stringCheck)
  	{
  		if(text.length > +[])
  		{
  			for(let i=0;i < text.length;++i)
  			{
  				trans += phonArray[text.charAt(i)] + "";
  			}

        var Ftrans = "";
        if(trans.length > +[])
    		{
    			for(let i=+[];i < trans.length;++i)
    			{
    				Ftrans += phonArray[trans.charAt(i)] + "";
    			}
    		} else {
    			Ftrans +="The text field was empty. Please try again.";
    		}
        return Ftrans;
  		} else {
  			trans +="The text field was empty. Please try again.";
        return trans;
  		}
  	} else {
  		trans +="The text you entered contained illegal characters. Please try again.";
      return trans;
  	}

    return trans;

  }

  //print the OTP list
  printOTP() {
  	 var s = document.getElementsByClassName(styles.passForm)[0].listOTP.value;

  	 //convert all chars to HTML entities
  	 var escaped="";
  	 var c="";
  	 for(var i=+[]; i<s.length;++i)
  	 {
  			c = s.charAt(i);
  			if (c == '\n') {
  				 escaped += "<br />\n";
  			} else {
  				 c = c.charCodeAt(+[]);
  				 //c = 'x'+ c.toString(16);
  				 c = '&#'+ c + ';'
  				 escaped += c;
  			}
  	 }

     pWin = window.open('','pWin');
     pWin.document.open();
     pWin.document.write("<html><head><title>One Time Password List</title></head><style>body { font-family: courier}</style><body>");
     pWin.document.write(escaped);
     pWin.document.write("</body></html>");
     pWin.print();
     pWin.document.close();
     pWin.close();
  	 return true;
  }

  makeid(length) {
     var result           = '';
     var characters       = normalSymbols + specialSymbols;
     var charactersLength = characters.length;
     for ( var i = +[]; i < length; ++i ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

}

export default JSRand
