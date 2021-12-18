
const url = window.location.pathname;
const sp= new URLSearchParams(url);

if(sp.get('user_name') != null){
localStorage.setItem('Name', sp.get('given_name')+' '+sp.get('family_name'));
localStorage.setItem('user_name', sp.get('user_name'));
localStorage.setItem('email', sp.get('email'));
localStorage.setItem('ifLoggedIn', 'Yes');

}
else{
localStorage.setItem('ifLoggedIn', 'No');
}