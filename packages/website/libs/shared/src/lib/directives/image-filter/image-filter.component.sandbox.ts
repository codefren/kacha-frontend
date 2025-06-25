import { sandboxOf } from 'angular-playground';
import { ImageFilterDirective } from './image-filter.directive';

export default sandboxOf(ImageFilterDirective)
    .add('green', {
        template: `
            <img appImageFilter='green'
                src="https://pngimage.net/wp-content/uploads/2018/06/imagem-png-2.png">`,
    })
    .add('blue', {
        template: `
            <img appImageFilter='blue'
                src="https://pngimage.net/wp-content/uploads/2018/06/imagem-png-2.png">`,
    })
    .add('custom', {
        template: `
            <img appImageFilter='#fa0c4d'
                src="https://pngimage.net/wp-content/uploads/2018/06/imagem-png-2.png">`,
    })
    .add('map-marker', {
        template: `
            <img appImageFilter='#000000'
                src="https://i.ibb.co/DkK6zbq/transparent-map-marker.png">`,
    });
