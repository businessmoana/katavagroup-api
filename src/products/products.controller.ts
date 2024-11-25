import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './media/product-images'); // Specify the folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use a temporary unique name initially
  },
});

@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async getProducts(@Query() query: GetProductsDto): Promise<ProductPaginator> {
    return this.productsService.getProducts(query);
  }

  @Get(':param')
  getProduct(
    @Param('param') param: number,
  ) {
    return this.productsService.getProduct(param);
  }


  @Put('deactive-product-item/:id')
  async deactiveProductItem(@Param('id') id: number,) {
    return this.productsService.deactiveProductItem(id);
  }


  @Post('/product-item')
  async createOrUpdateProductItem(@Body() data) {
    return this.productsService.createOrUpdateProductItem(data);
  }

  @Post('/status')
  async changeProductStatus(@Body() data) {
    return this.productsService.changeProductStatus(data);
  }

  @Post()
  @UseInterceptors(FileInterceptor('item_image', { storage })) // Adjust according to your field name
  async createOrUpdateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createOrUpdateProductDto: any,
  ) {
    const product = await this.productsService.createOrUpdateProduct(createOrUpdateProductDto);
    if (file) {
      const oldFileName = file.filename; // Get the temporary filename from Multer
      await this.productsService.updateProductImage(product.id, oldFileName); // Rename the file
    }
    return true;
  }

  @Put('remove-image/:id')
  async removeProductImage(@Param('id') id: number, @Body() imageName,) {
    return this.productsService.removeProductImage(id, imageName);
  }

  @Put('duplicate-product/:id')
  async duplicateProduct(@Param('id') id: number) {
    return this.productsService.duplicateProduct(id);
  }

  @Post('/pick-pack')
  async getOrders(@Body() data) {
    return this.productsService.getOrders(data);
  }

  @Post('/pick-pack/approve-order')
  async approveOrder(@Body() data) {
    return this.productsService.approveOrder(data);
  }

  @Post('/pick-pack/remove-order-item')
  removeOrderItem(@Body() data) {
    return this.productsService.removeOrderItem(data);
  }

  @Delete('/pick-pack/remove-order/:id')
  removeOrder(@Param('id') id: any) {
    return this.productsService.removeOrder(id);
  }

  @Post('/pick-pack/save-pallet-tax')
  savePalletTax(@Body() data) {
    return this.productsService.savePalletTax(data);
  }

  @Get('/pick-pack/order-item/:id')
  async getOrderItem(@Param('id') id: number) {
    return await this.productsService.getOrderItem(id);
  }

  @Post('/pick-pack/order-item-update')
  updateOrderItem(@Body() data) {
    return this.productsService.updateOrderItem(data);
  }

  @Get('/pick-pack/product-list')
  async getProductsList() {
    return await this.productsService.getProductsList();
  }
  
  @Post('/pick-pack/order-item-add')
  newOrderItem(@Body() data) {
    return this.productsService.newOrderItem(data);
  }
}
