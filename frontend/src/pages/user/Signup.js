import React from 'react';
import {Button, Form, message, Tabs} from 'antd';

import logo from '../../assets/img/logo.png';
import {Link} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";
import {Helmet} from "react-helmet";


const TabPane = Tabs.TabPane;

const PageLogo = () => {
    const style = {
        width: "50px",
        height: "50px",
        paddingRight: "0px",
        marginRight: "15px",
        margin_top: "10px"
    };
    return (
        <img src={logo}
             style={style}
             alt="Logo"/>
    )
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function signupButtonStatus (signup_status){
    return (signup_status === true) ? '' : 'Sign up';
}

function countContain(strPassword, strCheck)
{
    // Declare variables
    let nCount = 0;

    for (let i = 0; i < strPassword.length; i++)
    {
        if (strCheck.indexOf(strPassword.charAt(i)) > -1)
        {
            nCount++;
        }
    }

    return nCount;
}

function passwordPreventCommon(password) {
    const commonPassword = Array("123456","password","12345678","1234","pussy","12345","dragon","qwerty","696969","mustang","letmein","baseball","master","michael","football","shadow","monkey","abc123","pass","6969","jordan","harley","ranger","iwantu","jennifer","hunter","2000","test","batman","trustno1","thomas","tigger","robert","access","love","buster","1234567","soccer","hockey","killer","george","sexy","andrew","charlie","superman","asshole","dallas","jessica","panties","pepper","1111","austin","william","daniel","golfer","summer","heather","hammer","yankees","joshua","maggie","biteme","enter","ashley","thunder","cowboy","silver","richard","orange","merlin","michelle","corvette","bigdog","cheese","matthew","121212","patrick","martin","freedom","ginger","blowjob","nicole","sparky","yellow","camaro","secret","dick","falcon","taylor","111111","131313","123123","bitch","hello","scooter","please","","porsche","guitar","chelsea","black","diamond","nascar","jackson","cameron","654321","computer","amanda","wizard","xxxxxxxx","money","phoenix","mickey","bailey","knight","iceman","tigers","purple","andrea","horny","dakota","aaaaaa","player","sunshine","morgan","starwars","boomer","cowboys","edward","charles","girls","booboo","coffee","xxxxxx","bulldog","ncc1701","rabbit","peanut","john","johnny","gandalf","spanky","winter","brandy","compaq","carlos","tennis","james","mike","brandon","fender","anthony","blowme","ferrari","cookie","chicken","maverick","chicago","joseph","diablo","sexsex","hardcore","666666","willie","welcome","chris","panther","yamaha","justin","banana","driver","marine","angels","fishing","david","maddog","hooters","wilson","butthead","dennis","captain","bigdick","chester","smokey","xavier","steven","viking","snoopy","blue","eagles","winner","samantha","house","miller","flower","jack","firebird","butter","united","turtle","steelers","tiffany","zxcvbn","tomcat","golf","bond007","bear","tiger","doctor","gateway","gators","angel","junior","thx1138","porno","badboy","debbie","spider","melissa","booger","1212","flyers","fish","porn","matrix","teens","scooby","jason","walter","cumshot","boston","braves","yankee","lover","barney","victor","tucker","princess","mercedes","5150","doggie","zzzzzz","gunner","horney","bubba","2112","fred","johnson","xxxxx","tits","member","boobs","donald","bigdaddy","bronco","penis","voyager","rangers","birdie","trouble","white","topgun","bigtits","bitches","green","super","qazwsx","magic","lakers","rachel","slayer","scott","2222","asdf","video","london","7777","marlboro","srinivas","internet","action","carter","jasper","monster","teresa","jeremy","11111111","bill","crystal","peter","pussies","cock","beer","rocket","theman","oliver","prince","beach","amateur","7777777","muffin","redsox","star","testing","shannon","murphy","frank","hannah","dave","eagle1","11111","mother","nathan","raiders","steve","forever","angela","viper","ou812","jake","lovers","suckit","gregory","buddy","whatever","young","nicholas","lucky","helpme","jackie","monica","midnight","college","baby","brian","mark","startrek","sierra","leather","232323","4444","beavis","bigcock","happy","sophie","ladies","naughty","giants","booty","blonde","golden","0","fire","sandra","pookie","packers","einstein","dolphins","0","chevy","winston","warrior","sammy","slut","8675309","zxcvbnm","nipples","power","victoria","asdfgh","vagina","toyota","travis","hotdog","paris","rock","xxxx","extreme","redskins","erotic","dirty","ford","freddy","arsenal","access14","wolf","nipple","iloveyou","alex","florida","eric","legend","movie","success","rosebud","jaguar","great","cool","cooper","1313","scorpio","mountain","madison","987654","brazil","lauren","japan","naked","squirt","stars","apple","alexis","aaaa","bonnie","peaches","jasmine","kevin","matt","qwertyui","danielle","beaver","4321","4128","runner","swimming","dolphin","gordon","casper","stupid","shit","saturn","gemini","apples","august","3333","canada","blazer","cumming","hunting","kitty","rainbow","112233","arthur","cream","calvin","shaved","surfer","samson","kelly","paul","mine","king","racing","5555","eagle","hentai","newyork","little","redwings","smith","sticky","cocacola","animal","broncos","private","skippy","marvin","blondes","enjoy","girl","apollo","parker","qwert","time","sydney","women","voodoo","magnum","juice","abgrtyu","777777","dreams","maxwell","music","rush2112","russia","scorpion","rebecca","tester","mistress","phantom","billy","6666","albert");
    return commonPassword.includes(password);
}
function scorePassword(password){
    {
        const m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
        const m_strNumber = "0123456789";
        const m_strCharacters = "!@#$%^&*?_~";

        // Reset combination count
        let nScore = 0;

        // Password length
        // -- Less than 4 characters
        if (password.length < 5) {
            nScore += 5;
        }
        // -- 5 to 7 characters
        else if (password.length > 4 && password.length < 8) {
            nScore += 10;
        }
        // -- 8 or more
        else if (password.length > 7) {
            nScore += 25;
        }

        // Letters
        let nUpperCount = countContain(password, m_strUpperCase);
        let nLowerCount = countContain(password, m_strLowerCase);
        const nLowerUpperCount = nUpperCount + nLowerCount;
        // -- Letters are all lower case
        if (nUpperCount === 0 && nLowerCount !== 0) {
            nScore += 10;
        }
        // -- Letters are upper case and lower case
        else if (nUpperCount !== 0 && nLowerCount !== 0) {
            nScore += 20;
        }

        // Numbers
        let nNumberCount = countContain(password, m_strNumber);
        // -- 1 number
        if (nNumberCount === 1) {
            nScore += 10;
        }
        // -- 3 or more numbers
        if (nNumberCount >= 3) {
            nScore += 20;
        }

        // Characters
        let nCharacterCount = countContain(password, m_strCharacters);
        // -- 1 character
        if (nCharacterCount === 1) {
            nScore += 10;
        }
        // -- More than 1 character
        if (nCharacterCount > 1) {
            nScore += 25;
        }

        // Bonus
        // -- Letters and numbers
        if (nNumberCount !== 0 && nLowerUpperCount !== 0) {
            nScore += 2;
        }
        // -- Letters, numbers, and characters
        if (nNumberCount !== 0 && nLowerUpperCount !== 0 && nCharacterCount !== 0) {
            nScore += 3;
        }
        // -- Mixed case letters, numbers, and characters
        if (nNumberCount !== 0 && nUpperCount !== 0 && nLowerCount !== 0 && nCharacterCount !== 0) {
            nScore += 5;
        }
        return nScore;
    }
}

function checkPassStrength(pass) {
    return scorePassword(pass) >= 60;
}

class NormalSignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            fullname: '',
            businessname: '',
            businessemail: '',
            businesspassword: '',
            businessrepassword: '',
            signup_type: 'personal',
            password: '',
            repassword: '',
            signup_user: false,
            formErrors: {email: '', password: '', fullname: '', repassword: '',businessname:'',businessemail:'',businesspassword:'',businessrepassword:''},
            formValidity: {email: false, password: false, fullname: false, repassword: false,businessname:false,businessemail:false,businesspassword:false,businessrepassword:false},
            canSubmit: false,
            canSubmitBusiness:false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.PersonalSignupSubmit = this.PersonalSignupSubmit.bind(this);
        this.BusinessSignupSubmit = this.BusinessSignupSubmit.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        }, function () {
            this.validateField(name, value)
        })
    }



    validateField(name, value) {
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;
        const isEmail = name === "email";
        const isPassword = name === "password";
        const isFullName = name === "fullname";
        const isRePassword = name === "repassword";

        const isBusinessName = name === "businessname";
        const isBusinessPassword = name === "businesspassword";
        const isBusinessRePassword = name === "businessrepassword";
        const isBusinessEmail =  name === "businessemail";



        const emailTest = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
        const passwordStrengthTest = checkPassStrength(this.state.password);
        const passwordCommonTest = passwordPreventCommon(this.state.password);

        const business_passwordStrengthTest = checkPassStrength(this.state.businesspassword);
        const business_passwordCommonTest = passwordPreventCommon(this.state.businesspassword);

        validity[name] = value.length > 0;


        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);

        if (validity[name]) {
            if (isEmail) {
                validity[name] = emailTest.test(value);
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be a valid email address.`);
            } else if (isPassword) {
                //Is it a common password
                validity[name] = passwordCommonTest;
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? 'Your password is to common.' : ``);
                if (!fieldValidationErrors[name]){
                    //Is password strong enough
                    validity[name] = passwordStrengthTest;
                    fieldValidationErrors[name] = capitalizeFirstLetter(passwordStrengthTest ? '' : `${name} should be stronger.`);
                }
            } else if (isRePassword) {
                //Do password and repassword match?
                validity[name] = this.state.password === this.state.repassword;
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} and password are not the same.`);
            }

            else if (isBusinessEmail) {
                 validity[name] = emailTest.test(value);
                 fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be a valid email address.`);
             } else if (isBusinessPassword) {
                 //Is it a common password
                 validity[name] = business_passwordCommonTest;
                 fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? 'Your password is to common.' : ``);
                 if (!fieldValidationErrors[name]) {
                     //Is password strong enough
                     validity[name] = business_passwordStrengthTest;
                     fieldValidationErrors[name] = capitalizeFirstLetter(business_passwordStrengthTest ? '' : `${name} should be stronger.`);
                 }
             } else if (isBusinessRePassword) {
                 //Do password and repassword match?
                 validity[name] = this.state.businesspassword === this.state.businessrepassword;
                 fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} and password are not the same.`);
             }
        }

        this.setState({
            formErrors: fieldValidationErrors,
            formValidity: validity,
        }, () => this.canSubmit())
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'is-invalid');
    }

    canSubmit() {
        this.setState({canSubmit: this.state.formValidity.fullname && this.state.formValidity.repassword && this.state.formValidity.email && this.state.formValidity.password});
        this.setState({
            canSubmitBusiness: this.state.formValidity.businessname && this.state.formValidity.businessemail && this.state.formValidity.businesspassword && this.state.formValidity.businessrepassword
        })

        
    }

    PersonalSignupSubmit = (event) => {
        event.preventDefault();
        this.setState({
            signup_user: true
        });

        const {email, password,fullname} = this.state;

        let requestBody = {
            query: `
            mutation {
                createUser(userInput:{fullname: "${fullname}", email: "${email}", password: "${password}"}) {
                  _id
                }
              }
            `
          };
          const base_url = 'http://localhost:3000/graphql';
          fetch(base_url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        //Signup was a success
        message.success('You successfully signed up!');
        this.setState({
            redirect: true
         });
       })
      .catch(err => {
          //todo: display appropriate messages for errors
          message.error('There was a problem setting up the new account.');

          this.setState({
            signup_user: false,
            redirect:false
            });

          //Signup failed
        console.log(err);
      });
       
    };

    BusinessSignupSubmit = (event) => {
        event.preventDefault();
        this.setState({
            signup_user: true
        });

        const {businessemail,businesspassword,businessname} = this.state;

        
        let requestBody = {
             query: `
            mutation {
                createBusinessUser(userInput:{businessname: "${businessname}", email: "${businessemail}", password: "${businesspassword}"}) {
                  _id
                }
              }
            `
         };


         const base_url = 'http://localhost:3000/graphql';
         fetch(base_url, {
                 method: 'POST',
                 body: JSON.stringify(requestBody),
                 headers: {
                     'Content-Type': 'application/json'
                 }
             })
             .then(res => {
                 
                  console.log(res);

                 if (res.status !== 200 && res.status !== 201) {
                     throw new Error('Failed!');
                 }
                 return res.json();
             })
             .then(resData => {
                 //Signup was a success
                 message.success('You successfully signed up!');
                 this.setState({
                     redirect: true
                 });
             })
             .catch(err => {
                 //todo: display appropriete messafes for errors
                 message.error('There was a problem setting up the new account.');
                 

                 this.setState({
                     signup_user: false,
                     redirect: false
                 });

                 //Signup failed
                 console.log(err);
             });

    };

    handleTabChange = (event) => {
        if (this.state.signup_type === 'personal') {
            this.setState({
                signup_type: 'business'
            });
        } else {
            this.setState({
                signup_type: 'personal'
            });
        }
    };
    renderRedirect = () => {
        if (this.state.redirect === true){
            const redirect_url = '/login';
            return <Redirect to={redirect_url} />
        }
    };

    render() {
        const signup_user_status = this.state.signup_user;
        const keywords = ["signup", "RocketNow"];
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/signup";
        return (
            <div>
                <br/><br/><br/><br/>
                <div className="container-fluid">
                    <Helmet>
                        <title>Sign up</title>
                        <meta name="description" content="Signing up to RocketNow unlocks a whole new world." />
                        <meta property="og:title" content="SignUp to RocketNow" />
                        <meta name="keywords" content={keywords}/>
                        <link rel="canonial" href={cannonial_url}/>
                    </Helmet>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-3"/>
                                <div className="col-md-6">
                                    <h1 className="text-center">Sign up</h1>
                                    <PageLogo/>
                                    <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                                        <TabPane tab="Personal" key="1">
                                            <Form onSubmit={this.PersonalSignupSubmit} className="login-form">
                                                <Form.Item>
                                                    <label htmlFor="name">Full name</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.fullname)}`}
                                                        id="fullname"
                                                        name="fullname"
                                                        type="text"
                                                        placeholder="Enter full name"
                                                        value={this.state.fullname}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.fullname}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="email">Email address</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.email)}`}
                                                        id="email"
                                                        name="email"
                                                        type="text"
                                                        placeholder="Enter email"
                                                        value={this.state.email}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.email}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.password)}`}
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        placeholder="Create a password"
                                                        value={this.state.password}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.password}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="repassword">Re password</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.repassword)}`}
                                                        id="repassword"
                                                        name="repassword"
                                                        type="password"
                                                        placeholder="Re enter a password"
                                                        value={this.state.repassword}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.repassword}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Link to="/signup">Already a user? Sign in!</Link>
                                                </Form.Item>
                                                <Form.Item>
                                                    <p>By signing up you agree to NoNo Lines <a href="/tos/1">Terms of Service</a> and <a href="privacy/1">Privacy Notice</a></p>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button disabled={!this.state.canSubmit} size="large"
                                                            type="primary" loading={signup_user_status}
                                                            htmlType="submit">
                                                        {signupButtonStatus(this.state.signup_user)}
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                        <TabPane tab="Business" key="2">
                                         < Form onSubmit = {
                                             this.BusinessSignupSubmit
                                         }
                                         className = "login-form" >
                                                <Form.Item>
                                                    <label htmlFor="businessname">Business name</label>
                                                    <input
                                                        className = {
                                                            `form-control ${this.errorClass(this.state.formErrors.businessname)}`
                                                        }
                                                        id = "businessname"
                                                        name = "businessname"
                                                        type="text"
                                                        placeholder="Your Business name"
                                                        value={this.state.businessname}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.businessname}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="businessemail">Email address</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.email)}`}
                                                        id="businessemail"
                                                        name="businessemail"
                                                        type="text"
                                                        placeholder="Enter your email"
                                                        value={this.state.businessemail}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.businessemail}</div>
                                                </Form.Item>
                                                    <Form.Item>
                                                    <label htmlFor="businesspassword">Password</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.businesspassword)}`}
                                                        id = "businesspassword"
                                                        name = "businesspassword"
                                                        type="password"
                                                        placeholder="Create a password"
                                                        value = {
                                                            this.state.businesspassword
                                                        }
                                                        onChange={this.handleChange}
                                                    />
                                                    < div className = "invalid-feedback" > {
                                                        this.state.formErrors.businesspassword
                                                    } </div>
                                                </Form.Item>
                                                <Form.Item>
                                                    < label htmlFor = "businessrepassword" > Re password </label>
                                                    <input
                                                        className = {
                                                            `form-control ${this.errorClass(this.state.formErrors.businessrepassword)}`
                                                        }
                                                        id = "businessrepassword"
                                                        name = "businessrepassword"
                                                        type="password"
                                                        placeholder="Re enter a password"
                                                        value={this.state.businessrepassword}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.businessrepassword}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Link to="/signup">Already a user? Sign in!</Link>
                                                </Form.Item>
                                                <Form.Item>
                                                    <p>By signing up you agree to NoNo Lines <a href="/tos/1">Terms of Service</a> and <a href="privacy/1">Privacy Notice</a></p>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button disabled={!this.state.canSubmitBusiness} size="large"
                                                            type="primary" loading={signup_user_status}
                                                            htmlType="submit">
                                                        {signupButtonStatus(this.state.signup_user)}
                                                    </Button>
                                                </Form.Item>
                                                </Form>
                                        </TabPane>
                                    </Tabs>
                                    {this.renderRedirect()}
                                </div>
                                <div className="col-md-3"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Form.create()(NormalSignupForm);

//Todo: terms of service
//todo: privacy notice
//todo: valiation db-< check if email already exsists
//todo: check that password and email are not the same
//todo: 12k most common passwords to array