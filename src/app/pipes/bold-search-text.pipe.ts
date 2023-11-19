import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'boldSearchText'
})
export class BoldSearchTextPipe implements PipeTransform {

  transform(name: string, keyword: string): string {
    const index = name.toLowerCase().indexOf(keyword.toLowerCase());
    if (index >= 0) {
      return name.substring(0, index) + '<b>'
        + name.substring(index, keyword.length + index)
        + '</b>'
        + name.substring(keyword.length + index);
    }
    return name;
  }

}
