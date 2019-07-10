<?php
  /* 
    Функция, обрабатывающая файл, переданный в $_POST.
    Добавляет поддержку индексации файлов в случае $doRewrite === false.
    Причины возможных ошибок комментированы.
    Функция возвращает true в случае успеха и false в случае неудачи.
  */

	function ProcessPostFile($whichFile,$toDirectory,$doRewrite) {
		if($whichFile['size'] > 0) {
			# Файл существует.
			if($whichFile['error'] === UPLOAD_ERR_OK) {
				# Файл загружен корректно.
				$fileExtension = pathinfo($whichFile['name'],PATHINFO_EXTENSION);
				# Если мы не выполняем перезапись, файл должен иметь постфикс к своему имени.
				$filenamePostfix = ".$fileExtension";
				$i = 0;
				if(!$doRewrite){
					do {
						$i++;
					} while(file_exists("$toDirectory_$i.$fileExtension"));
					$filenamePostfix = "_$i$filenamePostfix";
				}

				# А теперь перемещаем текущий файл.
				if(move_uploaded_file($whichFile['tmp_name'],"$toDirectory$filenamePostfix")){
					# Файл успешно загружен на сервер.
          return true;
				} else {
					# Файл не был загружен на сервер.
				}
			} else {
				# При загрузке файла возникла ошибка.
				switch($whichFile['error']){
					case UPLOAD_ERR_INI_SIZE:
						# Превышен максимальный размер файла, указанный в php.ini. Проблема пользователя.
						break;
					case UPLOAD_ERR_FORM_SIZE:
						# Превышен максимальный размер файла, указанный в форме. Проблема пользователя.
						break;
					case UPLOAD_ERR_PARTIAL:
						# Файл по какой-то причине не был загружен до конца. Проблема пользователя.
						break;
					case UPLOAD_ERR_NO_FILE:
						# Файл изначально не был передан в форму. Проблема пользователя.
						break;
					case UPLOAD_ERR_NO_TMP_DIR:
						# Отсутствует папка для хранения временных файлов на сервере. Проблема сайта.
						break;
					case UPLOAD_ERR_CANT_WRITE:
						# Нет прав доступа для записи файла в указанную временную директорию. Проблема сайта.
						break;
					case UPLOAD_ERR_EXTENSION:
						# PHP-обработчик не разрешил загружать файл. Возможно, указано недопустимое расширение. Проблема пользователя.
						break;
				}
			}
		} else {
			# Файл не существует.
		}
    
    return false;
	}
