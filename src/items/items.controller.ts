import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = '.' + file.originalname.split('.')[1];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() newItem: CreateItemDto,
  ) {
    //console.log(file);
    //console.log(newItem);
    try {
      newItem.image = file.filename;
      //console.log(newItem);
      const res = await this.itemsService.createItem(newItem);
      //console.log(res);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      //console.log(error);
      return {
        success: false,
        data: error,
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    // const image = 'images-1539.jpg';
    // //return res.sendFile(__dirname + '/uploads/' + image);
    // const file = res.sendFile(image, { root: './uploads/' });
    // console.log(file);
    // const imagen = of(res.sendFile(join(process.cwd(), 'uploads/' + image)));
    // console.log(imagen);
    const resultado = await this.itemsService.getItems();
    const item = resultado.map((list, index) => {
      //console.log(list.item_image);
      const image = list.item_image;
      const imagePath = `http://localhost:4000/items/pictures/${image}`;
      return {
        ...list,
        index: index + 1,
        item_image: imagePath,
        //console.log(res.sendFile(image, { root: './uploads/' }));
        // item_image: of(
        //   res.send(await list),
        //   res.sendFile(join(process.cwd(), 'uploads/' + list.item_image)),
        // ),
        //item_image: res.sendFile(path: filename, options:{root:'./uploads'})
      };
    });
    //console.log(item);
    return JSON.stringify(item);
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/' });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const edit = await this.itemsService.getItem(id);
    //console.log(edit);
    return JSON.stringify(edit);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      updateItem.image = file.filename;
      //console.log(updateItem);
      const res = await this.itemsService.updateItem(id, updateItem);
      //console.log(res);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      //console.log(error);
      return {
        success: false,
        data: error,
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.deleteItem(id);
  }
}
