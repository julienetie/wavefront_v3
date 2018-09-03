const { wave, components, append } = wavefront;


const anotherHelloWorld = document.createElement('div')
anotherHelloWorld.textContent = 'It\'s another one';
anotherHelloWorld.className = "anooooo";

  // const createHelloWorld = (message) => wave `<h1 Hello-World><span></span></h1>`;
  const $helloWorld = (message) => wave `<h1 Hello-World><span style="background: red;" >${message}</span></h1>`;
  const $beBop = wave `<h1 BeBop><span>How Are you </span></h1>`;
  

const $article = wave `
    <article News-article>
        <p>If ever there was evidence of God, the humble pea is it.</p>
        <p>Mother Nature has never created something of such perfection, something that takes Darwin's theory of evolution to the extent that a natural element can, over millions of years, evolve into something so flawless.</p>
        ${$helloWorld('Hello World! B')}
        ${'#'}
        ${$beBop}
        ${'%'}
        ${'£'}
        ${anotherHelloWorld}
        <aside class="pquote">
            <blockquote Quote>
                <p>It is not an exaggeration to say that peas can be described as nothing less than perfect spheres of joy.</p>
            </blockquote>
        </aside>

        <p FirstLine >The green seed of the white-flowering climbing leguminous papilionaceous plant, pisum sativum, has become a dining-table favourite for good reason.</p>
        <p>The perfect accompaniment to any meal, the diminutive spherical vegetable brings joy to billions worldwide, be they fresh, frozen, canned or dried.</p>
        <p>Even leaving aside the astounding nutritional package, the taste explosion and texture of a well cooked pea is undeniably enough to award this deceptively simple seed the gold-medal of the foodstuff Olympics.</p>
        <p>There is debate surrounding the tampering of the form of the original spherical vegetable. The question as to whether the 'mushy' pea is sacrilege or an innovative approach to re-package the perfect product is a sensitive issue. A similar argument arises when approaching the relatively new craze of mangetout. In-depth study is required, but for now it is too early to assess the true importance of this baby pea pod.</p>
        <p LastLine>In its original form, the pea is a giant amongst food products and a deity of the vegetable world. It is not an exaggeration to say that peas can be described as nothing less than perfect spheres of joy.</p>
    </article>`;

// Append 
append(document.body, $article);
// console.log('$helloWorld.element', $helloWorld.element)
// let click = true;
// document.addEventListener('mousedown', ()=>{
//     click = !click;
//     // console.log('click', $helloWorld)
//     if(click){
//         // $helloWorld.element.replace(createHelloWorld('Go to school').element);
//     }else{
//         // $helloWorld.element.replace(createHelloWorld('La de daaa').element);
//     }
// 
// })
 // document.body.appendChild($article.element);
 // document.body.appendChild(greeting.components)
 // document.body.appendChild(greeting.element)

/*
 
 1) ComponentName is the first attributes defined in an element 
 2) Each word starts with a capital letter 
 3) can use hypens or underscores 
 4) Can be lower case if starts with underscore.


*/