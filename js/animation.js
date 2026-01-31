export function animateBlocks(blocksArray){
    blocksArray.forEach((block, index) => {
        console.log('Animating');

        setTimeout(()=>{
            block.classList.add('animate-blocks');
        }, index*1500);
    });
}