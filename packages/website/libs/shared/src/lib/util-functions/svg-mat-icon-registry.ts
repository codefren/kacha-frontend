import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export function addSVGIconsToRegistry(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    iconsData: { label: string; url: string }[],
) {
    for (let iconData of iconsData)
        iconRegistry.addSvgIcon(
            iconData.label,
            sanitizer.bypassSecurityTrustResourceUrl(iconData.url),
        );
}
